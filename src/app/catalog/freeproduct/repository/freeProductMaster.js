const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { FREEPRODUCT, FREEPRODUCT_OUTLET, FREEPRODUCT_LOGS } = require("../commons/constants");
const { ITEM } = require("../../commons");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
function OfferMasterRepo(fastify) {
  async function getOfferMasterPaginate({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search, from_date, to_date } = queryString;

    const query = knex
      .select([
        `${FREEPRODUCT.NAME}.*`,
      ])
      .from(`${FREEPRODUCT.NAME}`);


    if (Number(status) && Number(status) == 1) {
      query.where(
        `${FREEPRODUCT.NAME}.${FREEPRODUCT.COLUMNS.ACTIVE}`,
        1
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${FREEPRODUCT.NAME}.${FREEPRODUCT.COLUMNS.ACTIVE}`,
        0
      );
    }

    if (search && search.length >= 3) {
      query.where(function () {
        this.where(FREEPRODUCT.COLUMNS.FNAME, "ilike", `%${search}%`);
      });
    }

    if (!from_date == '') {
      query.whereRaw(
        `DATE(${FREEPRODUCT.NAME}.${FREEPRODUCT.COLUMNS.FFROM}) >= ?`, from_date
      )
    }
    if (!to_date == '') {
      query.whereRaw(
        `DATE(${FREEPRODUCT.NAME}.${FREEPRODUCT.COLUMNS.FTO}) <= ?`, to_date
      )
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Free Product",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Promotions Master data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }


    const responsewith_outletdetails = await Promise.all(
      response.data.map(async offers => {
        const outlets_lines = await knex
          .select([
            `${OUTLETS.NAME}.*`,
          ])
          .from(`${FREEPRODUCT_OUTLET.NAME} as ${FREEPRODUCT_OUTLET.NAME}`)
          .leftJoin(
            `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
            `${FREEPRODUCT_OUTLET.NAME}.${FREEPRODUCT_OUTLET.COLUMNS.OUTLET_ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
          )
          .where(`${FREEPRODUCT_OUTLET.NAME}.${FREEPRODUCT_OUTLET.COLUMNS.SID}`, offers.sid);

        return { ...offers, outlets_lines };
      })
    );


    return {
      data: responsewith_outletdetails,
      meta: response.meta
    };
  }
  async function postOfferMaster({ params, body, logTrace, userDetails }) {
    const knex = this;
    if (Array.isArray(body.outlet_ids) && body.outlet_ids.length > 0) {
      const query = knex(FREEPRODUCT.NAME)
        .join(
          FREEPRODUCT_OUTLET.NAME,
          `${FREEPRODUCT_OUTLET.NAME}.${FREEPRODUCT_OUTLET.COLUMNS.SID}`,
          `${FREEPRODUCT.NAME}.${FREEPRODUCT.COLUMNS.SID}`
        )
        .where(`${FREEPRODUCT.NAME}.${FREEPRODUCT.COLUMNS.FNAME}`, body.fname)
        .whereIn(`${FREEPRODUCT_OUTLET.NAME}.${FREEPRODUCT_OUTLET.COLUMNS.OUTLET_ID}`, body.outlet_ids)
        .where(`${FREEPRODUCT.NAME}.${FREEPRODUCT.COLUMNS.ACTIVE}`, 1)
        .where(`${FREEPRODUCT_OUTLET.NAME}.${FREEPRODUCT_OUTLET.COLUMNS.IS_ACTIVE}`, true)
        .andWhere((builder) => {
          builder
            .whereBetween(`${FREEPRODUCT.NAME}.${FREEPRODUCT.COLUMNS.FFROM}`, [body.ffrom, body.fto])
            .orWhereBetween(`${FREEPRODUCT.NAME}.${FREEPRODUCT.COLUMNS.FTO}`, [body.ffrom, body.fto])
            .orWhere((subquery) => {
              subquery
                .where(`${FREEPRODUCT.NAME}.${FREEPRODUCT.COLUMNS.FFROM}`, '<=', body.ffrom)
                .andWhere(`${FREEPRODUCT.NAME}.${FREEPRODUCT.COLUMNS.FTO}`, '>=', body.fto);
            });
        });

      const exists_response = await query;

      if (exists_response.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Freeproduct Already Exists",
          property: "",
          code: "NOT_ACCEPTABLE"
        });
      }
    }


    const query_insert = await knex(`${FREEPRODUCT.NAME}`)
      .returning(['sid']) // Fixed `retrning` typo
      .insert({
        [FREEPRODUCT.COLUMNS.FNAME]: body.fname,
        [FREEPRODUCT.COLUMNS.FFROM]: body.ffrom,
        [FREEPRODUCT.COLUMNS.FTO]: body.fto,
        [FREEPRODUCT.COLUMNS.ACTIVE]: body.active || 1,
        [FREEPRODUCT.COLUMNS.OUTLET]: Array.isArray(body.outlet_ids) ? body.outlet_ids.join(",") : null,
        [FREEPRODUCT.COLUMNS.COMPANY_ID]: body.company_id || 1,
        [FREEPRODUCT.COLUMNS.CREATED_BY]: userDetails.id,
        [FREEPRODUCT.COLUMNS.UPDATED_BY]: userDetails.id,
      });

    // Ensure insert was successful
    if (!query_insert || query_insert.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating free product",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    const offerId = query_insert[0].sid;

    // Insert into related tables if data is provided
    const outletInserts = (Array.isArray(body.outlet_ids) && body.outlet_ids.length > 0) ?
      body.outlet_ids.map(outlet_id => ({
        [FREEPRODUCT_OUTLET.COLUMNS.SID]: offerId,
        [FREEPRODUCT_OUTLET.COLUMNS.OUTLET_ID]: outlet_id,
        [FREEPRODUCT_OUTLET.COLUMNS.IS_ACTIVE]: true,
        [FREEPRODUCT_OUTLET.COLUMNS.COMPANY_ID]: body.company_id || 1,
        [FREEPRODUCT_OUTLET.COLUMNS.CREATED_BY]: userDetails.id,
        [FREEPRODUCT_OUTLET.COLUMNS.UPDATED_BY]: userDetails.id,
      })) : [];



    await Promise.all([
      outletInserts.length > 0 && knex(FREEPRODUCT_OUTLET.NAME).insert(outletInserts)
    ]);

    // Insert log entry
    await knex(FREEPRODUCT_LOGS.NAME).insert({
      [FREEPRODUCT_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
      [FREEPRODUCT_LOGS.COLUMNS.SID]: offerId,
      [FREEPRODUCT_LOGS.COLUMNS.CHANGED_DATA]: body, //JsonB
      [FREEPRODUCT_LOGS.COLUMNS.COMPANY_ID]: body.company_id || 1,
      [FREEPRODUCT_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [FREEPRODUCT_LOGS.COLUMNS.USER_ID]: userDetails.id,
    });

    return { success: true };
  }
  async function putOfferMaster({ sid, body, logTrace, userDetails }) {
    const knex = this;
    console.log("sid", sid)

    // Check if the offer exists
    const existingOffer = await knex(FREEPRODUCT.NAME)
      .where(FREEPRODUCT.COLUMNS.SID, sid)
      // .where(FREEPRODUCT.COLUMNS.ACTIVE, 1)
      .first();

    if (!existingOffer) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Freeproduct not found or inactive",
        property: "",
        code: "NOT_FOUND"
      });
    }

    if (Array.isArray(body.outlet_ids) && body.outlet_ids.length > 0) {
      const query = knex(FREEPRODUCT.NAME)
        .join(
          FREEPRODUCT_OUTLET.NAME,
          `${FREEPRODUCT_OUTLET.NAME}.${FREEPRODUCT_OUTLET.COLUMNS.SID}`,
          `${FREEPRODUCT.NAME}.${FREEPRODUCT.COLUMNS.SID}`
        )
        .where(`${FREEPRODUCT.NAME}.${FREEPRODUCT.COLUMNS.FNAME}`, body.fname)
        .whereIn(`${FREEPRODUCT_OUTLET.NAME}.${FREEPRODUCT_OUTLET.COLUMNS.OUTLET_ID}`, body.outlet_ids)
        .where(`${FREEPRODUCT.NAME}.${FREEPRODUCT.COLUMNS.ACTIVE}`, 1)
        .where(`${FREEPRODUCT_OUTLET.NAME}.${FREEPRODUCT_OUTLET.COLUMNS.IS_ACTIVE}`, true)
        .whereNot(`${FREEPRODUCT.NAME}.${FREEPRODUCT.COLUMNS.SID}`, sid)
        .andWhere((builder) => {
          builder
            .whereBetween(`${FREEPRODUCT.NAME}.${FREEPRODUCT.COLUMNS.FFROM}`, [body.ffrom, body.fto])
            .orWhereBetween(`${FREEPRODUCT.NAME}.${FREEPRODUCT.COLUMNS.FTO}`, [body.ffrom, body.fto])
            .orWhere((subquery) => {
              subquery
                .where(`${FREEPRODUCT.NAME}.${FREEPRODUCT.COLUMNS.FFROM}`, '<=', body.ffrom)
                .andWhere(`${FREEPRODUCT.NAME}.${FREEPRODUCT.COLUMNS.FTO}`, '>=', body.ffrom);
            });
        });

      const exists_response = await query;

      if (exists_response.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Promotion Name Already Exists",
          property: "",
          code: "NOT_ACCEPTABLE"
        });
      }
    }

    // Prepare data for updating the main offer
    const offerUpdateData = {

      [FREEPRODUCT.COLUMNS.FNAME]: body.fname,
      [FREEPRODUCT.COLUMNS.FFROM]: body.ffrom,
      [FREEPRODUCT.COLUMNS.FTO]: body.fto,
      [FREEPRODUCT.COLUMNS.ACTIVE]: body.active,
      [FREEPRODUCT.COLUMNS.OUTLET]: Array.isArray(body.outlet_ids) ? body.outlet_ids.join(",") : null,
      [FREEPRODUCT.COLUMNS.COMPANY_ID]: body.company_id || 1,
      [FREEPRODUCT.COLUMNS.UPDATED_BY]: userDetails.id,
      [FREEPRODUCT.COLUMNS.UPDATED_AT]: knex.fn.now()
    };

    // Begin transaction to ensure atomicity
    await knex.transaction(async trx => {
      // Update main offer
      await trx(FREEPRODUCT.NAME)
        .where(FREEPRODUCT.COLUMNS.SID, sid)
        .update(offerUpdateData);

      // Handle outlet updates
      if (Array.isArray(body.outlet_ids)) {
        await trx(FREEPRODUCT_OUTLET.NAME)
          .where(FREEPRODUCT_OUTLET.COLUMNS.SID, sid)
          .delete();

        const outletInserts = body.outlet_ids.map(outlet_id => ({
          [FREEPRODUCT_OUTLET.COLUMNS.SID]: sid,
          [FREEPRODUCT_OUTLET.COLUMNS.OUTLET_ID]: outlet_id,
          [FREEPRODUCT_OUTLET.COLUMNS.IS_ACTIVE]: body.active,
          [FREEPRODUCT_OUTLET.COLUMNS.COMPANY_ID]: body.company_id ?? 1,
          [FREEPRODUCT_OUTLET.COLUMNS.CREATED_BY]: userDetails.id,
          [FREEPRODUCT_OUTLET.COLUMNS.UPDATED_BY]: userDetails.id,
        }));

        if (outletInserts.length > 0) {
          await trx(FREEPRODUCT_OUTLET.NAME).insert(outletInserts);
        }
      }

      // Insert log entry
      await knex(FREEPRODUCT_LOGS.NAME).insert({
        [FREEPRODUCT_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
        [FREEPRODUCT_LOGS.COLUMNS.SID]: sid,
        [FREEPRODUCT_LOGS.COLUMNS.OLD_DATA]: existingOffer,
        [FREEPRODUCT_LOGS.COLUMNS.CHANGED_DATA]: body, //JsonB
        [FREEPRODUCT_LOGS.COLUMNS.COMPANY_ID]: body.company_id || 1,
        [FREEPRODUCT_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
        [FREEPRODUCT_LOGS.COLUMNS.USER_ID]: userDetails.id,
      });
    });
    return { success: true };
  }
  async function deleteOfferMaster({ sid, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(FREEPRODUCT.NAME).where(FREEPRODUCT.COLUMNS.SID, sid);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Free product not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    // const query1 = knex(ITEM.NAME).where(
    //   ITEM.COLUMNS.UOM_ID,
    //   unit_id
    // );

    // const exists_response1 = await query1;

    // if (exists_response1.length > 0) {
    //   throw CustomError.create({
    //     httpCode: StatusCodes.NOT_ACCEPTABLE,
    //     message: "Unit is mapped with a product and cannot be deleted",
    //     property: "",
    //     code: "NOT_ACCEPTABLE"
    //   });
    // }

    const query_delete = knex(FREEPRODUCT.NAME)
      .where(FREEPRODUCT.COLUMNS.SID, sid)
      .del();
    logQuery({
      logger: fastify.log,
      query: query_delete,
      context: "delete Free Product",
      logTrace
    });
    const response = await query_delete;
    const query_delete1 = knex(FREEPRODUCT_OUTLET.NAME)
      .where(FREEPRODUCT_OUTLET.COLUMNS.SID, sid)
      .del();
    logQuery({
      logger: fastify.log,
      query: query_delete1,
      context: "delete FREEPRODUCT_OUTLET",
      logTrace
    });
    const response1 = await query_delete1;



    // Insert log entry
    await knex(FREEPRODUCT_LOGS.NAME).insert({
      [FREEPRODUCT_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
      [FREEPRODUCT_LOGS.COLUMNS.SID]: sid,
      [FREEPRODUCT_LOGS.COLUMNS.CHANGED_DATA]: exists_response[0], //JsonB 
      [FREEPRODUCT_LOGS.COLUMNS.COMPANY_ID]: exists_response[0]?.company_id
        ? String(exists_response[0].company_id).trim()
        : null,
      [FREEPRODUCT_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [FREEPRODUCT_LOGS.COLUMNS.USER_ID]: userDetails.id,
    });
    return { success: true };
  }
  async function getOfferMasterInfo({ queryString, params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${FREEPRODUCT.NAME}.*`,
      ])
      .from(`${FREEPRODUCT.NAME}`)
      .where(`${FREEPRODUCT.NAME}.${FREEPRODUCT.COLUMNS.SID}`, params.sid);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Free Product",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "FreeProduct data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }


    const responsewith_outletdetails = await Promise.all(
      response.map(async offers => {
        const outlets_lines = await knex
          .select([
            `${OUTLETS.NAME}.*`,
          ])
          .from(`${FREEPRODUCT_OUTLET.NAME} as ${FREEPRODUCT_OUTLET.NAME}`)
          .leftJoin(
            `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
            `${FREEPRODUCT_OUTLET.NAME}.${FREEPRODUCT_OUTLET.COLUMNS.OUTLET_ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
          )
          .where(`${FREEPRODUCT_OUTLET.NAME}.${FREEPRODUCT_OUTLET.COLUMNS.SID}`, params.sid);

        return { ...offers, outlets_lines };
      })
    );


    return responsewith_outletdetails[0];
  }

  return {
    postOfferMaster,
    putOfferMaster,
    deleteOfferMaster,
    getOfferMasterInfo,
    getOfferMasterPaginate
  };
}

module.exports = OfferMasterRepo;

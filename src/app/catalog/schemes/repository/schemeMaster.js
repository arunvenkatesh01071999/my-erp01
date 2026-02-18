const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { SCHEMES, SCHEMES_OUTLET, SCHEMES_LOGS } = require("../commons/constants");
const { ITEM } = require("../../commons");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");

function OfferMasterRepo(fastify) {
  async function getOfferMasterPaginate({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search, from_date, to_date } = queryString;

    const query = knex
      .select([
        `${SCHEMES.NAME}.*`,
        `${ITEM.NAME}.pro_name as product_name`, // Buy product name 
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`, // Buy product name 
      ])
      .from(`${SCHEMES.NAME}`)
      .leftJoin(
        `${ITEM.NAME}`,
        // `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
        // `${ITEM.NAME}.${ITEM.COLUMNS.ID}`, 
        knex.raw(`CAST(${ITEM.NAME}.${ITEM.COLUMNS.ID} AS TEXT)`),
        `${SCHEMES.NAME}.${SCHEMES.COLUMNS.PID}`
      ); 

    if (Number(status) && Number(status) == 1) {
      query.where(
        `${SCHEMES.NAME}.${SCHEMES.COLUMNS.ACTIVE}`,
        1
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${SCHEMES.NAME}.${SCHEMES.COLUMNS.ACTIVE}`,
        0
      );
    }

    if (search && search.length >= 3) {
      query.where(function () {
        this.where(SCHEMES.COLUMNS.SNAME, "ilike", `%${search}%`);
      });
    }

    if (!from_date == '') {
      query.whereRaw(
        `DATE(${SCHEMES.NAME}.${SCHEMES.COLUMNS.FDATE}) >= ?`, from_date
      )
    }
    if (!to_date == '') {
      query.whereRaw(
        `DATE(${SCHEMES.NAME}.${SCHEMES.COLUMNS.TDATE}) <= ?`, to_date
      )
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Scheme Master",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Offer Master data not found",
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
          .from(`${SCHEMES_OUTLET.NAME} as ${SCHEMES_OUTLET.NAME}`)
          .leftJoin(
            `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
            `${SCHEMES_OUTLET.NAME}.${SCHEMES_OUTLET.COLUMNS.OUTLET_ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
          )
          .where(`${SCHEMES_OUTLET.NAME}.${SCHEMES_OUTLET.COLUMNS.SID}`, offers.sid);

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
      const query = knex(SCHEMES.NAME)
        .join(
          SCHEMES_OUTLET.NAME,
          `${SCHEMES_OUTLET.NAME}.${SCHEMES_OUTLET.COLUMNS.SID}`,
          `${SCHEMES.NAME}.${SCHEMES.COLUMNS.SID}`
        )
        .where(`${SCHEMES.NAME}.${SCHEMES.COLUMNS.PID}`, body.pid)
        .whereIn(`${SCHEMES_OUTLET.NAME}.${SCHEMES_OUTLET.COLUMNS.OUTLET_ID}`, body.outlet_ids)
        .where(`${SCHEMES.NAME}.${SCHEMES.COLUMNS.ACTIVE}`, 1)
        .where(`${SCHEMES_OUTLET.NAME}.${SCHEMES_OUTLET.COLUMNS.IS_ACTIVE}`, true)
        .andWhere((builder) => {
          builder
            .whereBetween(`${SCHEMES.NAME}.${SCHEMES.COLUMNS.FDATE}`, [body.fdate, body.tdate])
            .orWhereBetween(`${SCHEMES.NAME}.${SCHEMES.COLUMNS.TDATE}`, [body.fdate, body.tdate])
            .orWhere((subquery) => {
              subquery
                .where(`${SCHEMES.NAME}.${SCHEMES.COLUMNS.FDATE}`, '<=', body.fdate)
                .andWhere(`${SCHEMES.NAME}.${SCHEMES.COLUMNS.TDATE}`, '>=', body.tdate);
            });
        });

      const exists_response = await query;

      if (exists_response.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Scheme Already Exists for this outlets and this products",
          property: "",
          code: "NOT_ACCEPTABLE"
        });
      }
    }


    const query_insert = await knex(`${SCHEMES.NAME}`)
      .returning(['sid']) // Fixed `retrning` typo
      .insert({
        [SCHEMES.COLUMNS.SNAME]: body.sname,
        [SCHEMES.COLUMNS.FDATE]: body.fdate,
        [SCHEMES.COLUMNS.TDATE]: body.tdate,
        [SCHEMES.COLUMNS.PAMOUNT]: body.pamount,
        [SCHEMES.COLUMNS.DTYPE]: body.dtype,
        [SCHEMES.COLUMNS.DVAL]: body.dval,
        [SCHEMES.COLUMNS.ACTIVE]: body.active || 1,
        // [SCHEMES.COLUMNS.PID]: body.pid,
        [SCHEMES.COLUMNS.PID]: Array.isArray(body.pid) ? body.pid.join(",") : null,
        [SCHEMES.COLUMNS.SMODE]: body.smode,
        [SCHEMES.COLUMNS.OUTLET_ID]: Array.isArray(body.outlet_ids) ? body.outlet_ids.join(",") : null,
        [SCHEMES.COLUMNS.STYPE]: body.stype,
        [SCHEMES.COLUMNS.CATID]: Array.isArray(body.cat_ids) ? body.cat_ids.join(",") : "",
        [SCHEMES.COLUMNS.QTY]: body.qty || 1,
        [SCHEMES.COLUMNS.COMPANY_ID]: body.company_id || 1,
        [SCHEMES.COLUMNS.CREATED_BY]: userDetails.id,
        [SCHEMES.COLUMNS.UPDATED_BY]: userDetails.id,
      });

    // Ensure insert was successful
    if (!query_insert || query_insert.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating offer master",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    const offerId = query_insert[0].sid;

    // Insert into related tables if data is provided
    const outletInserts = (Array.isArray(body.outlet_ids) && body.outlet_ids.length > 0) ?
      body.outlet_ids.map(outlet_id => ({
        [SCHEMES_OUTLET.COLUMNS.SID]: offerId,
        [SCHEMES_OUTLET.COLUMNS.OUTLET_ID]: outlet_id,
        [SCHEMES_OUTLET.COLUMNS.IS_ACTIVE]: true,
        [SCHEMES_OUTLET.COLUMNS.COMPANY_ID]: body.company_id || 1,
        [SCHEMES_OUTLET.COLUMNS.CREATED_BY]: userDetails.id,
        [SCHEMES_OUTLET.COLUMNS.UPDATED_BY]: userDetails.id,
      })) : [];



    await Promise.all([
      outletInserts.length > 0 && knex(SCHEMES_OUTLET.NAME).insert(outletInserts)
    ]);

    // Insert log entry
    await knex(SCHEMES_LOGS.NAME).insert({
      [SCHEMES_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
      [SCHEMES_LOGS.COLUMNS.SID]: offerId,
      [SCHEMES_LOGS.COLUMNS.CHANGED_DATA]: body, //JsonB
      [SCHEMES_LOGS.COLUMNS.COMPANY_ID]: body.company_id || 1,
      [SCHEMES_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [SCHEMES_LOGS.COLUMNS.USER_ID]: userDetails.id,
    });

    return { success: true };
  }
  async function putOfferMaster({ sid, body, logTrace, userDetails }) {
    const knex = this;


    // Check if the offer exists
    const existingOffer = await knex(SCHEMES.NAME)
      .where(SCHEMES.COLUMNS.SID, sid)
      // .where(SCHEMES.COLUMNS.ACTIVE, 1)
      .first();

    if (!existingOffer) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Scheme not found or inactive",
        property: "",
        code: "NOT_FOUND"
      });
    }

    if (Array.isArray(body.outlet_ids) && body.outlet_ids.length > 0) {
      const query = knex(SCHEMES.NAME)
        .join(
          SCHEMES_OUTLET.NAME,
          `${SCHEMES_OUTLET.NAME}.${SCHEMES_OUTLET.COLUMNS.SID}`,
          `${SCHEMES.NAME}.${SCHEMES.COLUMNS.SID}`
        )
        .where(`${SCHEMES.NAME}.${SCHEMES.COLUMNS.PID}`, body.pid)
        .whereIn(`${SCHEMES_OUTLET.NAME}.${SCHEMES_OUTLET.COLUMNS.OUTLET_ID}`, body.outlet_ids)
        .where(`${SCHEMES.NAME}.${SCHEMES.COLUMNS.ACTIVE}`, 1)
        .where(`${SCHEMES_OUTLET.NAME}.${SCHEMES_OUTLET.COLUMNS.IS_ACTIVE}`, true)
        .whereNot(`${SCHEMES.NAME}.${SCHEMES.COLUMNS.SID}`, sid)
        .andWhere((builder) => {
          builder
            .whereBetween(`${SCHEMES.NAME}.${SCHEMES.COLUMNS.FDATE}`, [body.fdate, body.tdate])
            .orWhereBetween(`${SCHEMES.NAME}.${SCHEMES.COLUMNS.TDATE}`, [body.fdate, body.tdate])
            .orWhere((subquery) => {
              subquery
                .where(`${SCHEMES.NAME}.${SCHEMES.COLUMNS.FDATE}`, '<=', body.fdate)
                .andWhere(`${SCHEMES.NAME}.${SCHEMES.COLUMNS.TDATE}`, '>=', body.tdate);
            });
        });

      const exists_response = await query;

      if (exists_response.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Scheme Already Exists for this outlets and this products",
          property: "",
          code: "NOT_ACCEPTABLE"
        });
      }
    }

    // Prepare data for updating the main offer
    const offerUpdateData = {
      [SCHEMES.COLUMNS.SNAME]: body.sname,
      [SCHEMES.COLUMNS.FDATE]: body.fdate,
      [SCHEMES.COLUMNS.TDATE]: body.tdate,
      [SCHEMES.COLUMNS.PAMOUNT]: body.pamount,
      [SCHEMES.COLUMNS.DTYPE]: body.dtype,
      [SCHEMES.COLUMNS.DVAL]: body.dval,
      [SCHEMES.COLUMNS.ACTIVE]: body.active,
      // [SCHEMES.COLUMNS.PID]: body.pid,
      [SCHEMES.COLUMNS.PID]: Array.isArray(body.pid) ? body.pid.join(",") : null,
      [SCHEMES.COLUMNS.SMODE]: body.smode,
      [SCHEMES.COLUMNS.OUTLET_ID]: Array.isArray(body.outlet_ids) ? body.outlet_ids.join(",") : null,
      [SCHEMES.COLUMNS.STYPE]: body.stype,
      [SCHEMES.COLUMNS.CATID]: Array.isArray(body.cat_ids) ? body.cat_ids.join(",") : "",
      [SCHEMES.COLUMNS.QTY]: body.qty || 1,
      [SCHEMES.COLUMNS.COMPANY_ID]: body.company_id || 1,
      [SCHEMES.COLUMNS.UPDATED_BY]: userDetails.id,
      [SCHEMES.COLUMNS.UPDATED_AT]: knex.fn.now(), // If using a timestamp
    };

    // Begin transaction to ensure atomicity
    await knex.transaction(async trx => {
      // Update main offer
      await trx(SCHEMES.NAME)
        .where(SCHEMES.COLUMNS.SID, sid)
        .update(offerUpdateData);

      // Handle outlet updates
      if (Array.isArray(body.outlet_ids)) {
        await trx(SCHEMES_OUTLET.NAME)
          .where(SCHEMES_OUTLET.COLUMNS.SID, sid)
          .delete();

        const outletInserts = body.outlet_ids.map(outlet_id => ({
          [SCHEMES_OUTLET.COLUMNS.SID]: sid,
          [SCHEMES_OUTLET.COLUMNS.OUTLET_ID]: outlet_id,
          [SCHEMES_OUTLET.COLUMNS.IS_ACTIVE]: body.active,
          [SCHEMES_OUTLET.COLUMNS.COMPANY_ID]: body.company_id ?? 1,
          [SCHEMES_OUTLET.COLUMNS.CREATED_BY]: userDetails.id,
          [SCHEMES_OUTLET.COLUMNS.UPDATED_BY]: userDetails.id,
        }));

        if (outletInserts.length > 0) {
          await trx(SCHEMES_OUTLET.NAME).insert(outletInserts);
        }
      }

      // Insert log entry
      await knex(SCHEMES_LOGS.NAME).insert({
        [SCHEMES_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
        [SCHEMES_LOGS.COLUMNS.SID]: sid,
        [SCHEMES_LOGS.COLUMNS.OLD_DATA]: existingOffer,
        [SCHEMES_LOGS.COLUMNS.CHANGED_DATA]: body, //JsonB
        [SCHEMES_LOGS.COLUMNS.COMPANY_ID]: body.company_id || 1,
        [SCHEMES_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
        [SCHEMES_LOGS.COLUMNS.USER_ID]: userDetails.id,
      });
    });
    return { success: true };
  }
  async function deleteOfferMaster({ sid, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(SCHEMES.NAME).where(SCHEMES.COLUMNS.SID, sid);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "OFFER_MASTER not found to delete",
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

    const query_delete = knex(SCHEMES.NAME)
      .where(SCHEMES.COLUMNS.SID, sid)
      .del();
    logQuery({
      logger: fastify.log,
      query: query_delete,
      context: "delete Schemes",
      logTrace
    });
    const response = await query_delete;
    const query_delete1 = knex(SCHEMES_OUTLET.NAME)
      .where(SCHEMES_OUTLET.COLUMNS.SID, sid)
      .del();
    logQuery({
      logger: fastify.log,
      query: query_delete1,
      context: "delete SCHEMES_OUTLET",
      logTrace
    });
    const response1 = await query_delete1;



    // Insert log entry
    await knex(SCHEMES_LOGS.NAME).insert({
      [SCHEMES_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
      [SCHEMES_LOGS.COLUMNS.SID]: sid,
      [SCHEMES_LOGS.COLUMNS.CHANGED_DATA]: exists_response[0], //JsonB 
      [SCHEMES_LOGS.COLUMNS.COMPANY_ID]: exists_response[0]?.company_id
        ? String(exists_response[0].company_id).trim()
        : null,
      [SCHEMES_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [SCHEMES_LOGS.COLUMNS.USER_ID]: userDetails.id,
    });
    return { success: true };
  }
  async function getOfferMasterInfo({ queryString, params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${SCHEMES.NAME}.*`,
        `${ITEM.NAME}.pro_name as product_name`, // Buy product name 
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
      ])
      .from(`${SCHEMES.NAME}`)
      .leftJoin(
        `${ITEM.NAME}`,
        // `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
        `${SCHEMES.NAME}.${SCHEMES.COLUMNS.PID}`
      )
      .where(`${SCHEMES.NAME}.${SCHEMES.COLUMNS.SID}`, params.sid);



    logQuery({
      logger: fastify.log,
      query,
      context: "Get Schemes",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Schemes data not found",
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
          .from(`${SCHEMES_OUTLET.NAME} as ${SCHEMES_OUTLET.NAME}`)
          .leftJoin(
            `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
            `${SCHEMES_OUTLET.NAME}.${SCHEMES_OUTLET.COLUMNS.OUTLET_ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
          )
          .where(`${SCHEMES_OUTLET.NAME}.${SCHEMES_OUTLET.COLUMNS.SID}`, params.sid);

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

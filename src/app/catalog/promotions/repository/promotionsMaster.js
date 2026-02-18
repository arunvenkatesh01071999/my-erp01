const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { PROMOTION, PROMOTION_OUTLET, PROMOTION_LOGS } = require("../commons/constants");
const { ITEM } = require("../../commons");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
function OfferMasterRepo(fastify) {
  async function getOfferMasterPaginate({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search, from_date, to_date } = queryString;

    const query = knex
      .select([
        `${PROMOTION.NAME}.*`,
      ])
      .from(`${PROMOTION.NAME}`);


    if (Number(status) && Number(status) == 1) {
      query.where(
        `${PROMOTION.NAME}.${PROMOTION.COLUMNS.ACTIVE}`,
        1
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${PROMOTION.NAME}.${PROMOTION.COLUMNS.ACTIVE}`,
        0
      );
    }

    if (search && search.length >= 3) {
      query.where(function () {
        this.where(PROMOTION.COLUMNS.PNAME, "ilike", `%${search}%`);
      });
    }

    if (!from_date == '') {
      query.whereRaw(
        `DATE(${PROMOTION.NAME}.${PROMOTION.COLUMNS.FDATE}) >= ?`, from_date
      )
    }
    if (!to_date == '') {
      query.whereRaw(
        `DATE(${PROMOTION.NAME}.${PROMOTION.COLUMNS.TDATE}) <= ?`, to_date
      )
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Promotions Master",
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
          .from(`${PROMOTION_OUTLET.NAME} as ${PROMOTION_OUTLET.NAME}`)
          .leftJoin(
            `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
            `${PROMOTION_OUTLET.NAME}.${PROMOTION_OUTLET.COLUMNS.OUTLET_ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
          )
          .where(`${PROMOTION_OUTLET.NAME}.${PROMOTION_OUTLET.COLUMNS.PID}`, offers.pid);

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
      const query = knex(PROMOTION.NAME)
        .join(
          PROMOTION_OUTLET.NAME,
          `${PROMOTION_OUTLET.NAME}.${PROMOTION_OUTLET.COLUMNS.PID}`,
          `${PROMOTION.NAME}.${PROMOTION.COLUMNS.PID}`
        )
        .where(`${PROMOTION.NAME}.${PROMOTION.COLUMNS.PNAME}`, body.pname)
        .whereIn(`${PROMOTION_OUTLET.NAME}.${PROMOTION_OUTLET.COLUMNS.OUTLET_ID}`, body.outlet_ids)
        .where(`${PROMOTION.NAME}.${PROMOTION.COLUMNS.ACTIVE}`, 1)
        .where(`${PROMOTION_OUTLET.NAME}.${PROMOTION_OUTLET.COLUMNS.IS_ACTIVE}`, true)
        .andWhere((builder) => {
          builder
            .whereBetween(`${PROMOTION.NAME}.${PROMOTION.COLUMNS.FDATE}`, [body.fdate, body.tdate])
            .orWhereBetween(`${PROMOTION.NAME}.${PROMOTION.COLUMNS.TDATE}`, [body.fdate, body.tdate])
            .orWhere((subquery) => {
              subquery
                .where(`${PROMOTION.NAME}.${PROMOTION.COLUMNS.FDATE}`, '<=', body.fdate)
                .andWhere(`${PROMOTION.NAME}.${PROMOTION.COLUMNS.TDATE}`, '>=', body.tdate);
            });
        });

      const exists_response = await query;

      if (exists_response.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Promotions Already Exists",
          property: "",
          code: "NOT_ACCEPTABLE"
        });
      }
    }


    const query_insert = await knex(`${PROMOTION.NAME}`)
      .returning(['pid']) // Fixed `retrning` typo
      .insert({
        [PROMOTION.COLUMNS.PNAME]: body.pname,
        [PROMOTION.COLUMNS.PAMOUNT]: body.pamount,
        [PROMOTION.COLUMNS.FDATE]: body.fdate,
        [PROMOTION.COLUMNS.TDATE]: body.tdate,
        [PROMOTION.COLUMNS.ACTIVE]: 1,
        [PROMOTION.COLUMNS.OUTLET]: Array.isArray(body.outlet_ids) ? body.outlet_ids.join(",") : null,
        [PROMOTION.COLUMNS.COMPANY_ID]: body.company_id || 1,
        [PROMOTION.COLUMNS.CREATED_BY]: userDetails.id,
        [PROMOTION.COLUMNS.UPDATED_BY]: userDetails.id,
      });

    // Ensure insert was successful
    if (!query_insert || query_insert.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating promotions",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    const offerId = query_insert[0].pid;

    // Insert into related tables if data is provided
    const outletInserts = (Array.isArray(body.outlet_ids) && body.outlet_ids.length > 0) ?
      body.outlet_ids.map(outlet_id => ({
        [PROMOTION_OUTLET.COLUMNS.PID]: offerId,
        [PROMOTION_OUTLET.COLUMNS.OUTLET_ID]: outlet_id,
        [PROMOTION_OUTLET.COLUMNS.IS_ACTIVE]: true,
        [PROMOTION_OUTLET.COLUMNS.COMPANY_ID]: body.company_id || 1,
        [PROMOTION_OUTLET.COLUMNS.CREATED_BY]: userDetails.id,
        [PROMOTION_OUTLET.COLUMNS.UPDATED_BY]: userDetails.id,
      })) : [];



    await Promise.all([
      outletInserts.length > 0 && knex(PROMOTION_OUTLET.NAME).insert(outletInserts)
    ]);

    // Insert log entry
    await knex(PROMOTION_LOGS.NAME).insert({
      [PROMOTION_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
      [PROMOTION_LOGS.COLUMNS.PID]: offerId,
      [PROMOTION_LOGS.COLUMNS.CHANGED_DATA]: body, //JsonB
      [PROMOTION_LOGS.COLUMNS.COMPANY_ID]: body.company_id || 1,
      [PROMOTION_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [PROMOTION_LOGS.COLUMNS.USER_ID]: userDetails.id,
    });

    return { success: true };
  }
  async function putOfferMaster({ pid, body, logTrace, userDetails }) {
    const knex = this;


    // Check if the offer exists
    const existingOffer = await knex(PROMOTION.NAME)
      .where(PROMOTION.COLUMNS.PID, pid)
      // .where(PROMOTION.COLUMNS.ACTIVE, 1)
      .first();

    if (!existingOffer) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Promotion not found or inactive",
        property: "",
        code: "NOT_FOUND"
      });
    }

    if (Array.isArray(body.outlet_ids) && body.outlet_ids.length > 0) {
      const query = knex(PROMOTION.NAME)
        .join(
          PROMOTION_OUTLET.NAME,
          `${PROMOTION_OUTLET.NAME}.${PROMOTION_OUTLET.COLUMNS.PID}`,
          `${PROMOTION.NAME}.${PROMOTION.COLUMNS.PID}`
        )
        .where(`${PROMOTION.NAME}.${PROMOTION.COLUMNS.PNAME}`, body.pname)
        .whereIn(`${PROMOTION_OUTLET.NAME}.${PROMOTION_OUTLET.COLUMNS.OUTLET_ID}`, body.outlet_ids)
        .where(`${PROMOTION.NAME}.${PROMOTION.COLUMNS.ACTIVE}`, 1)
        .where(`${PROMOTION_OUTLET.NAME}.${PROMOTION_OUTLET.COLUMNS.IS_ACTIVE}`, true)
        .whereNot(`${PROMOTION.NAME}.${PROMOTION.COLUMNS.PID}`, pid)
        .andWhere((builder) => {
          builder
            .whereBetween(`${PROMOTION.NAME}.${PROMOTION.COLUMNS.FDATE}`, [body.fdate, body.tdate])
            .orWhereBetween(`${PROMOTION.NAME}.${PROMOTION.COLUMNS.TDATE}`, [body.fdate, body.tdate])
            .orWhere((subquery) => {
              subquery
                .where(`${PROMOTION.NAME}.${PROMOTION.COLUMNS.FDATE}`, '<=', body.fdate)
                .andWhere(`${PROMOTION.NAME}.${PROMOTION.COLUMNS.TDATE}`, '>=', body.tdate);
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

      [PROMOTION.COLUMNS.PNAME]: body.pname,
      [PROMOTION.COLUMNS.PAMOUNT]: body.pamount,
      [PROMOTION.COLUMNS.FDATE]: body.fdate,
      [PROMOTION.COLUMNS.TDATE]: body.tdate,
      [PROMOTION.COLUMNS.ACTIVE]: body.active,
      [PROMOTION.COLUMNS.OUTLET]: Array.isArray(body.outlet_ids) ? body.outlet_ids.join(",") : null,
      [PROMOTION.COLUMNS.COMPANY_ID]: body.company_id || 1,
      [PROMOTION.COLUMNS.UPDATED_BY]: userDetails.id,
      [PROMOTION.COLUMNS.UPDATED_AT]: knex.fn.now(),
    };

    // Begin transaction to ensure atomicity
    await knex.transaction(async trx => {
      // Update main offer
      await trx(PROMOTION.NAME)
        .where(PROMOTION.COLUMNS.PID, pid)
        .update(offerUpdateData);

      // Handle outlet updates
      if (Array.isArray(body.outlet_ids)) {
        await trx(PROMOTION_OUTLET.NAME)
          .where(PROMOTION_OUTLET.COLUMNS.PID, pid)
          .delete();

        const outletInserts = body.outlet_ids.map(outlet_id => ({
          [PROMOTION_OUTLET.COLUMNS.PID]: pid,
          [PROMOTION_OUTLET.COLUMNS.OUTLET_ID]: outlet_id,
          [PROMOTION_OUTLET.COLUMNS.IS_ACTIVE]: body.active,
          [PROMOTION_OUTLET.COLUMNS.COMPANY_ID]: body.company_id ?? 1,
          [PROMOTION_OUTLET.COLUMNS.CREATED_BY]: userDetails.id,
          [PROMOTION_OUTLET.COLUMNS.UPDATED_BY]: userDetails.id,
        }));

        if (outletInserts.length > 0) {
          await trx(PROMOTION_OUTLET.NAME).insert(outletInserts);
        }
      }

      // Insert log entry
      await knex(PROMOTION_LOGS.NAME).insert({
        [PROMOTION_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
        [PROMOTION_LOGS.COLUMNS.PID]: pid,
        [PROMOTION_LOGS.COLUMNS.OLD_DATA]: existingOffer,
        [PROMOTION_LOGS.COLUMNS.CHANGED_DATA]: body, //JsonB
        [PROMOTION_LOGS.COLUMNS.COMPANY_ID]: body.company_id || 1,
        [PROMOTION_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
        [PROMOTION_LOGS.COLUMNS.USER_ID]: userDetails.id,
      });
    });
    return { success: true };
  }
  async function deleteOfferMaster({ pid, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(PROMOTION.NAME).where(PROMOTION.COLUMNS.PID, pid);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "PROMOTION not found to delete",
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

    const query_delete = knex(PROMOTION.NAME)
      .where(PROMOTION.COLUMNS.PID, pid)
      .del();
    logQuery({
      logger: fastify.log,
      query: query_delete,
      context: "delete Promotions",
      logTrace
    });
    const response = await query_delete;
    const query_delete1 = knex(PROMOTION_OUTLET.NAME)
      .where(PROMOTION_OUTLET.COLUMNS.PID, pid)
      .del();
    logQuery({
      logger: fastify.log,
      query: query_delete1,
      context: "delete PROMOTION_OUTLET",
      logTrace
    });
    const response1 = await query_delete1;



    // Insert log entry
    await knex(PROMOTION_LOGS.NAME).insert({
      [PROMOTION_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
      [PROMOTION_LOGS.COLUMNS.PID]: pid,
      [PROMOTION_LOGS.COLUMNS.CHANGED_DATA]: exists_response[0], //JsonB 
      [PROMOTION_LOGS.COLUMNS.COMPANY_ID]: exists_response[0]?.company_id
        ? String(exists_response[0].company_id).trim()
        : null,
      [PROMOTION_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [PROMOTION_LOGS.COLUMNS.USER_ID]: userDetails.id,
    });
    return { success: true };
  }
  async function getOfferMasterInfo({ queryString, params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${PROMOTION.NAME}.*`,
      ])
      .from(`${PROMOTION.NAME}`)
      .where(`${PROMOTION.NAME}.${PROMOTION.COLUMNS.PID}`, params.pid);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Promotions",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Promotions data not found",
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
          .from(`${PROMOTION_OUTLET.NAME} as ${PROMOTION_OUTLET.NAME}`)
          .leftJoin(
            `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
            `${PROMOTION_OUTLET.NAME}.${PROMOTION_OUTLET.COLUMNS.OUTLET_ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
          )
          .where(`${PROMOTION_OUTLET.NAME}.${PROMOTION_OUTLET.COLUMNS.PID}`, params.pid);

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

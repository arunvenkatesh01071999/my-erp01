const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { REASON } = require("../commons/constants");
const { SUB_REASON } = require("../commons/constants");

// Need Catalog DB Connection

function mainReasonRepo(fastify) {

  async function postReason({ body, userDetails, }) {
    const knex = this;

    const exists_response = await knex(REASON.NAME)
      .where(REASON.COLUMNS.REASON_NAME, 'ILIKE', String(body.category_name).trim())
      .first();

    if (exists_response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Reason Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    const query_insert = await knex(REASON.NAME)
      .insert({
        [REASON.COLUMNS.REASON_NAME]: String(body.reason_name).trim(),
        [REASON.COLUMNS.COMPANY_ID]: userDetails.company_id,
        [REASON.COLUMNS.IS_ACTIVE]: body.is_active,
        [REASON.COLUMNS.CREATED_BY]: userDetails.id,
        [REASON.COLUMNS.CREATED_AT]: new Date(),

      })
      .returning(['id']);

    // Ensure insert was successful
    if (!query_insert || query_insert.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating category",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }
    return { success: true };
  }

  async function putReason({ params, userDetails, body, logTrace }) {
    const knex = this;
    const query = knex(REASON.NAME)
      .where(REASON.COLUMNS.ID, params.reason_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Reason not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${REASON.NAME}`)
      .where(`${REASON.COLUMNS.ID}`, params.reason_id)
      .update({
        [REASON.COLUMNS.REASON_NAME]: String(body.reason_name).trim(),
        [REASON.COLUMNS.COMPANY_ID]: userDetails.company_id,
        [REASON.COLUMNS.IS_ACTIVE]: body.is_active,
        [REASON.COLUMNS.UPDATED_BY]: userDetails.id,
        [REASON.COLUMNS.UPDATED_AT]: new Date(),
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while update category",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }


  async function getReason({ logTrace, queryString, params }) {
    const knex = this;
    const { search } = queryString;

    const query = knex(REASON.NAME)
      .orderBy(REASON.COLUMNS.CREATED_BY, "ASC");

    // if (search && search !== '') {
    //   query.whereRaw(
    //     `${REASON.NAME}.${REASON.COLUMNS.REASON_NAME} LIKE ?`, [`%${search}%`]
    //   );
    // }

    if (search && search.length > 0) {
      query.where(function () {
        this.where(REASON.COLUMNS.REASON_NAME, "ilike", `%${search}%`)
      });
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Reason",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Reason not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }


  async function getReasonPaginate({ logTrace, queryString, params }) {
    const knex = this;
    const { search } = queryString;

    const query = knex(REASON.NAME)
      .orderBy(REASON.COLUMNS.CREATED_BY, "ASC");

    // if (search && search !== '') {
    //   query.whereRaw(
    //     `${REASON.NAME}.${REASON.COLUMNS.REASON_NAME} LIKE ?`, [`%${search}%`]
    //   );
    // }

    if (search && search.length > 0) {
      query.where(function () {
        this.where(REASON.COLUMNS.REASON_NAME, "ilike", `%${search}%`)
      });
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Reason",
      logTrace
    });

    const response = await query.paginate({
      pageSize: params.page_size,
      currentPage: params.current_page
    });

    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Reason not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }





  async function getReasonInfo({ params, logTrace }) {
    const knex = this;
    const query = knex(REASON.NAME)
      .where(REASON.COLUMNS.IS_ACTIVE, "1")
      .andWhere(REASON.COLUMNS.ID, params.reason_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Reason Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Reason not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  async function deleteReason({ params, userDetails, body, logTrace }) {
    const knex = this;


    // Check if the reason exists
    const reason = await knex(REASON.NAME)
      .where(REASON.COLUMNS.ID, params.reason_id)
      .first();

    if (!reason) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Reason not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    await knex(REASON.NAME)
      .where(REASON.COLUMNS.ID, params.reason_id)
      .del();

    return { success: true };
  }





  return {
    postReason,
    putReason,
    getReason,
    deleteReason,
    getReasonInfo,
    getReasonPaginate
  };

}
module.exports = mainReasonRepo;

const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { PAY_TYPE_MASTER } = require("../../commons");
// const { params } = require("../schemas/putAccountMasterSchema");


function getPayTypeMasterRepo(fastify) {
  async function getPayTypeMaster({ body, params, logTrace, queryString }) {

    const knex = this;
    const { status, search } = queryString;

    const query = knex(PAY_TYPE_MASTER.NAME)

    if (Number(status) && Number(status) == 1) {
      query.where(
        `${PAY_TYPE_MASTER.NAME}.${PAY_TYPE_MASTER.COLUMNS.IS_ACTIVE}`,
        true
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${PAY_TYPE_MASTER.NAME}.${PAY_TYPE_MASTER.COLUMNS.IS_ACTIVE}`,
        false
      );
    }

    if (search && search.length >= 3) {
      query.where(function () {
        this.where(PAY_TYPE_MASTER.COLUMNS.PAY_TYPE_NAME, "ilike", `%${search}%`)
        // .orWhere(ACCOUNTMASTER.COLUMNS.ACNAME, "ilike", `%${search}%`)
      });
    };
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Pay Type Master",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    if (response.meta.pagination.total_pages < params.current_page) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Requested page is beyond the available data",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    return response;
  }

  async function getPayTypeMasterKey({ body, params, logTrace }) {
    const knex = this;
    const pay_type_key = params.pay_type_key


    const query = knex(PAY_TYPE_MASTER.NAME)
      .where(PAY_TYPE_MASTER.COLUMNS.PAY_TYPE_KEY, pay_type_key)
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Pay Type Master",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Get Pay Type Master",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function postPayTypeMaster({ params, body, logTrace, userDetails }) {
    const knex = this;


    const query_insert = await knex(`${PAY_TYPE_MASTER.NAME}`).insert({
      [PAY_TYPE_MASTER.COLUMNS.PAY_TYPE_NAME]: body.pay_type_name,
      [PAY_TYPE_MASTER.COLUMNS.PAY_TYPE_KEY]: body.pay_type_key,
      [PAY_TYPE_MASTER.COLUMNS.IS_ACTIVE]: body.is_active,
      [PAY_TYPE_MASTER.COLUMNS.CREATED_BY]: 2
      // [PayTypeMaster.COLUMNS.CREATED_BY]: parseInt(1)
    });

    const response = await query_insert;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error While Creating Pay Type",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }

  async function putPayTypeMaster({ id, body, logTrace, userDetails }) {
    const knex = this;

    const query = knex(PAY_TYPE_MASTER.NAME).where(PAY_TYPE_MASTER.COLUMNS.ID, id);

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Pay Type not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${PAY_TYPE_MASTER.NAME}`)
      .where(`${PAY_TYPE_MASTER.COLUMNS.ID}`, id)
      .update({
        [PAY_TYPE_MASTER.COLUMNS.PAY_TYPE_NAME]: body.pay_type_name,
        [PAY_TYPE_MASTER.COLUMNS.PAY_TYPE_KEY]: body.pay_type_key,
        [PAY_TYPE_MASTER.COLUMNS.IS_ACTIVE]: body.is_active,
        [PAY_TYPE_MASTER.COLUMNS.CREATED_BY]: 2

      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error While Updating Pay Type",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }

  async function deletePayTypeMaster({ id, body, logTrace }) {
    const knex = this;
    const query = knex(PAY_TYPE_MASTER.NAME).where(PAY_TYPE_MASTER.COLUMNS.ID, id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Pay Type not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_delete = knex(PAY_TYPE_MASTER.NAME)
      .where(PAY_TYPE_MASTER.COLUMNS.ID, id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete Pay Type",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Pay Type not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return { success: true };
  }



  return {
    postPayTypeMaster,
    putPayTypeMaster,
    getPayTypeMaster,
    deletePayTypeMaster,
    getPayTypeMasterKey
  };
}

module.exports = getPayTypeMasterRepo;

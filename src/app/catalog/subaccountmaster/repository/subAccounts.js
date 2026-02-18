const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { ACCOUNTMASTER, SUB_ACCOUNTMASTER } = require("../commons/constants");

// Need Catalog DB Connection

function subAccountsRepo(fastify) {
  async function postSubAccounts({ params, body, logTrace }) {
    const knex = this;
    const query = knex(SUB_ACCOUNTMASTER.NAME).where(
      SUB_ACCOUNTMASTER.COLUMNS.SUB_ACCOUNT_NAME,
      body.sub_account_name
    );

    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "SubAccounts Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    const query_insert = await knex(`${SUB_ACCOUNTMASTER.NAME}`).insert({
      [SUB_ACCOUNTMASTER.COLUMNS.SUB_ACCOUNT_NAME]: body.sub_account_name,
      [SUB_ACCOUNTMASTER.COLUMNS.ACC_ID]: body.acc_id,
      [SUB_ACCOUNTMASTER.COLUMNS.IS_ACTIVE]: body.is_active
    });

    const response = await query_insert;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating Sub Accounts",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }
  async function putSubAccounts({ subaccount_id, body, logTrace }) {
    const knex = this;
    const query = knex(SUB_ACCOUNTMASTER.NAME).where(
      SUB_ACCOUNTMASTER.COLUMNS.ID,
      subaccount_id
    );

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "SubAccounts not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${SUB_ACCOUNTMASTER.NAME}`)
      .where(`${SUB_ACCOUNTMASTER.COLUMNS.ID}`, subaccount_id)
      .update({
        [SUB_ACCOUNTMASTER.COLUMNS.SUB_ACCOUNT_NAME]: body.sub_account_name,
        [SUB_ACCOUNTMASTER.COLUMNS.ACC_ID]: body.acc_id,
        [SUB_ACCOUNTMASTER.COLUMNS.IS_ACTIVE]: body.is_active
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updating Subaccounts",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }
  async function getSubAccountsPaginate({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search } = queryString;

    const query = knex
      .select([
        `${SUB_ACCOUNTMASTER.NAME}.*`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ACNAME}`
      ])
      .from(`${SUB_ACCOUNTMASTER.NAME} as ${SUB_ACCOUNTMASTER.NAME}`)
      .leftJoin(
        `${ACCOUNTMASTER.NAME} as ${ACCOUNTMASTER.NAME}`,
        `${SUB_ACCOUNTMASTER.NAME}.${SUB_ACCOUNTMASTER.COLUMNS.ACC_ID}`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ID}`
      )
      .orderBy(SUB_ACCOUNTMASTER.COLUMNS.SUB_ACCOUNT_NAME, "ASC");

    if (Number(status) && Number(status) == 1) {
      query.where(
        `${SUB_ACCOUNTMASTER.NAME}.${SUB_ACCOUNTMASTER.COLUMNS.IS_ACTIVE}`,
        true
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${SUB_ACCOUNTMASTER.NAME}.${SUB_ACCOUNTMASTER.COLUMNS.IS_ACTIVE}`,
        false
      );
    }

    if (search && search.length >= 3) {
      query.where(function () {
        this.where(SUB_ACCOUNTMASTER.COLUMNS.SUB_ACCOUNT_NAME, "ilike", `%${search}%`)
          .orWhere(ACCOUNTMASTER.COLUMNS.ACNAME, "ilike", `%${search}%`)
      });
    };

    logQuery({
      logger: fastify.log,
      query,
      context: "Get SubCategories",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SubCategories not found",
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
  async function getSubAccounts({ logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${SUB_ACCOUNTMASTER.NAME}.*`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ACNAME}`
      ])
      .from(`${SUB_ACCOUNTMASTER.NAME} as ${SUB_ACCOUNTMASTER.NAME}`)
      .leftJoin(
        `${ACCOUNTMASTER.NAME} as ${ACCOUNTMASTER.NAME}`,
        `${SUB_ACCOUNTMASTER.NAME}.${SUB_ACCOUNTMASTER.COLUMNS.ACC_ID}`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ID}`
      )
      .where(`${SUB_ACCOUNTMASTER.NAME}.${SUB_ACCOUNTMASTER.COLUMNS.IS_ACTIVE}`, true)
      .orderBy(SUB_ACCOUNTMASTER.COLUMNS.SUB_ACCOUNT_NAME, "ASC");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get SubAccounts",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SubAccounts not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }
  async function deleteSubAccounts({ subaccount_id, body, logTrace }) {
    const knex = this;

    const query = knex(SUB_ACCOUNTMASTER.NAME).where(
      SUB_ACCOUNTMASTER.COLUMNS.ID,
      subaccount_id
    );

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "SubAccounts not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_delete = knex(SUB_ACCOUNTMASTER.NAME)
      .where(SUB_ACCOUNTMASTER.COLUMNS.ID, subaccount_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete SubAccounts",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SubAccounts not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return { success: true };
  }
  async function getSubAccountsInfo({ params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${SUB_ACCOUNTMASTER.NAME}.*`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ACNAME}`
      ])
      .from(`${SUB_ACCOUNTMASTER.NAME} as ${SUB_ACCOUNTMASTER.NAME}`)
      .leftJoin(
        `${ACCOUNTMASTER.NAME} as ${ACCOUNTMASTER.NAME}`,
        `${SUB_ACCOUNTMASTER.NAME}.${SUB_ACCOUNTMASTER.COLUMNS.ACC_ID}`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ID}`
      )
      .where(
        `${SUB_ACCOUNTMASTER.NAME}.${SUB_ACCOUNTMASTER.COLUMNS.ID}`,
        params.subaccount_id
      );

    logQuery({
      logger: fastify.log,
      query,
      context: "Get SubAccounts Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SubAccounts not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }
  async function getSubAccountsByAcc({ params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${SUB_ACCOUNTMASTER.NAME}.*`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ACNAME}`
      ])
      .from(`${SUB_ACCOUNTMASTER.NAME} as ${SUB_ACCOUNTMASTER.NAME}`)
      .leftJoin(
        `${ACCOUNTMASTER.NAME} as ${ACCOUNTMASTER.NAME}`,
        `${SUB_ACCOUNTMASTER.NAME}.${SUB_ACCOUNTMASTER.COLUMNS.ACC_ID}`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ID}`
      )
      .where(`${SUB_ACCOUNTMASTER.NAME}.${SUB_ACCOUNTMASTER.COLUMNS.IS_ACTIVE}`, true)
      .where(`${SUB_ACCOUNTMASTER.NAME}.${SUB_ACCOUNTMASTER.COLUMNS.ACC_ID}`, params.acc_id)
      .orderBy(SUB_ACCOUNTMASTER.COLUMNS.SUB_ACCOUNT_NAME, "ASC");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get SubAccounts",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SubAccounts not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }
  return {
    postSubAccounts,
    putSubAccounts,
    getSubAccounts,
    deleteSubAccounts,
    getSubAccountsInfo,
    getSubAccountsPaginate,
    getSubAccountsByAcc
  };
}

module.exports = subAccountsRepo;

const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { TRANSACTION_PROVIDER } = require("../../commons");
const { params } = require("../schemas/putTransactionProviderSchema");


function getTransactionProviderRepo(fastify) {
  async function getTransactionProvider({ logTrace }) {
    const knex = this;
    const query = knex(TRANSACTION_PROVIDER.NAME)
    // .where(TRANSACTION_PROVIDER.COLUMNS.IS_ACTIVE, "1")
    // .orderBy(TRANSACTION_PROVIDER.COLUMNS.ID, "DESC");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Transaction Provider Master",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Get Transaction Provider Master",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getTransactionProviderMerchantKey({ body, params, logTrace }) {
    const knex = this;
    const merchant_key = params.merchant_key


    const query = knex(TRANSACTION_PROVIDER.NAME)
      .where(TRANSACTION_PROVIDER.COLUMNS.MERCHANT_KEY, merchant_key)
    // .orderBy(TRANSACTION_PROVIDER.COLUMNS.ID, "DESC");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Transaction Provider Master",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Get Transaction Provider Master",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function postTransactionProvider({ params, body, logTrace, userDetails }) {
    const knex = this;


    const query_insert = await knex(`${TRANSACTION_PROVIDER.NAME}`).insert({
      [TRANSACTION_PROVIDER.COLUMNS.TRANSACTION_PROVIDER]: body.transaction_provider,
      [TRANSACTION_PROVIDER.COLUMNS.MERCHANT_ID]: body.merchant_id,
      [TRANSACTION_PROVIDER.COLUMNS.MERCHANT_KEY]: body.merchant_key,
      [TRANSACTION_PROVIDER.COLUMNS.URL]: body.url,
      [TRANSACTION_PROVIDER.COLUMNS.IS_ACTIVE]: parseInt(1),
      [TRANSACTION_PROVIDER.COLUMNS.CREATED_BY]: 2
      // [TransactionProvider.COLUMNS.CREATED_BY]: parseInt(1)
    });

    const response = await query_insert;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error While Creating Transaction Provider",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }

  async function putTransactionProvider({ id, body, logTrace, userDetails }) {
    const knex = this;

    const query = knex(TRANSACTION_PROVIDER.NAME).where(TRANSACTION_PROVIDER.COLUMNS.ID, id);

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Transaction Provider not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${TRANSACTION_PROVIDER.NAME}`)
      .where(`${TRANSACTION_PROVIDER.COLUMNS.ID}`, id)
      .update({
        [TRANSACTION_PROVIDER.COLUMNS.TRANSACTION_PROVIDER]: body.transaction_provider,
        [TRANSACTION_PROVIDER.COLUMNS.MERCHANT_ID]: body.merchant_id,
        [TRANSACTION_PROVIDER.COLUMNS.MERCHANT_KEY]: body.merchant_key,
        [TRANSACTION_PROVIDER.COLUMNS.URL]: body.url,
        [TRANSACTION_PROVIDER.COLUMNS.IS_ACTIVE]: parseInt(1),
        [TRANSACTION_PROVIDER.COLUMNS.CREATED_BY]: 2

      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error While Updating Transaction Provider",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }

  async function deleteTransactionProvider({ id, body, logTrace }) {
    const knex = this;
    const query = knex(TRANSACTION_PROVIDER.NAME).where(TRANSACTION_PROVIDER.COLUMNS.ID, id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Transaction Provider not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_delete = knex(TRANSACTION_PROVIDER.NAME)
      .where(TRANSACTION_PROVIDER.COLUMNS.ID, id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete Transaction Provider",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Transaction Provider not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return { success: true };
  }



  return {
    postTransactionProvider,
    putTransactionProvider,
    getTransactionProvider,
    deleteTransactionProvider,
    getTransactionProviderMerchantKey
  };
}

module.exports = getTransactionProviderRepo;

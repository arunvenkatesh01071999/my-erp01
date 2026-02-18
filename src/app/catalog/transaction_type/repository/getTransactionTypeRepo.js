const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { TRANSACTION_TYPE } = require("../../commons");


function getTransactionTypeRepo(fastify) {
  async function getTransactionType({ logTrace }) {
    const knex = this;
    const query = knex(TRANSACTION_TYPE.NAME)
    // .where(TRANSACTION_TYPE.COLUMNS.IS_ACTIVE, "1")
    // .orderBy(TRANSACTION_TYPE.COLUMNS.ID, "DESC");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Transaction type Master",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Get Transaction type Master",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }
  async function postTransactionType({ params, body, logTrace, userDetails }) {
    const knex = this;
    // const query = knex(TransactionType.NAME).where(
    //   TransactionType.COLUMNS.TYPEDESIGN_NAME,
    //   body.type_name
    // );

    // const exists_response = await query;

    // if (exists_response.length > 0) {
    //   throw CustomError.create({
    //     httpCode: StatusCodes.NOT_ACCEPTABLE,
    //     message: "TransactionType Name Already Exists",
    //     property: "",
    //     code: "NOT_ACCEPTABLE"
    //   });
    // }

    const query_insert = await knex(`${TRANSACTION_TYPE.NAME}`).insert({
      [TRANSACTION_TYPE.COLUMNS.TRANSACTION_TYPE]: body.transaction_type,
      [TRANSACTION_TYPE.COLUMNS.IS_ACTIVE]: parseInt(1),
      [TRANSACTION_TYPE.COLUMNS.CREATED_BY]: 2
      // [TransactionType.COLUMNS.CREATED_BY]: parseInt(1)
    });

    const response = await query_insert;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error While Creating Transaction type",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }

  async function putTransactionType({ id, body, logTrace, userDetails }) {
    const knex = this;

    const query = knex(TRANSACTION_TYPE.NAME).where(TRANSACTION_TYPE.COLUMNS.ID, id);

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Transaction type not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${TRANSACTION_TYPE.NAME}`)
      .where(`${TRANSACTION_TYPE.COLUMNS.ID}`, id)
      .update({
        [TRANSACTION_TYPE.COLUMNS.TRANSACTION_TYPE]: body.transaction_type,
        [TRANSACTION_TYPE.COLUMNS.IS_ACTIVE]: parseInt(1),
        [TRANSACTION_TYPE.COLUMNS.CREATED_BY]: 2

      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error While Updating Transaction type",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }

  async function deleteTransactionType({ id, body, logTrace }) {
    const knex = this;
    const query = knex(TRANSACTION_TYPE.NAME).where(TRANSACTION_TYPE.COLUMNS.ID, id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Transaction type not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_delete = knex(TRANSACTION_TYPE.NAME)
      .where(TRANSACTION_TYPE.COLUMNS.ID, id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete Transaction type",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Transaction type not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return { success: true };
  }



  return {
    postTransactionType,
    putTransactionType,
    getTransactionType,
    deleteTransactionType
  };
}

module.exports = getTransactionTypeRepo;

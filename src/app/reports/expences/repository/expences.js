const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { EXPENSES } = require("../../../expenses/expence/commons/constants")
const { HEADS, ACCOUNTMASTER } = require("../../../catalog/commons");


function paymentRepo(fastify) {
  async function getPaymentReport({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${EXPENSES.NAME}.*`,
        `${EXPENSES.NAME}.${EXPENSES.COLUMNS.DOCDATE}`,
        // `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME}`,
        // `${HEADS.NAME}.${HEADS.COLUMNS.COMPANY_ID}`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ACNAME} as account_name`,
      ])
      .from(EXPENSES.NAME)
      // .leftJoin(HEADS.NAME, `${EXPENSES.NAME}.${EXPENSES.COLUMNS.ID}`,
      //   `${HEADS.NAME}.${HEADS.COLUMNS.ID}`)

      .leftJoin(
        ACCOUNTMASTER.NAME,
        `${EXPENSES.NAME}.${EXPENSES.COLUMNS.ACC_ID}`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ID}`)

      .whereBetween(`${EXPENSES.NAME}.${EXPENSES.COLUMNS.DOCDATE}`, [body.from_date, body.to_date]);

    if (Number(body.acc_id) && Number(body.acc_id) != 0) {
      query.andWhere(`${EXPENSES.NAME}.${EXPENSES.COLUMNS.ACC_ID}`, Number(body.acc_id));
    }



    // logQuery({
    //   logger: fastify.log,
    //   query,
    //   context: "Get Expences",
    //   logTrace
    // });
    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response

  }


  return {
    getPaymentReport
  };
}

module.exports = paymentRepo;
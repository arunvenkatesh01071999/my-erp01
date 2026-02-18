const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { OUTLET_EXPENSES } = require("../../../outlet_expences/commons/constants")
const { HEADS, ACCOUNTMASTER } = require("../../../catalog/commons");





function outletExpencesRepo(fastify) {
  async function getOutletExpencesReport({ body, params, logTrace, userDetails, queryString }) {
    const knex = this;

    const query = knex
      .select([
        `${OUTLET_EXPENSES.NAME}.*`,
        `${OUTLET_EXPENSES.NAME}.${OUTLET_EXPENSES.COLUMNS.DOCDATE}`,
        // `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME}`,
        // `${HEADS.NAME}.${HEADS.COLUMNS.COMPANY_ID}`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ACNAME} as account_name`,

      ])
      .from(OUTLET_EXPENSES.NAME)
      // .leftJoin(
      //   HEADS.NAME,
      //   `${OUTLET_EXPENSES.NAME}.${OUTLET_EXPENSES.COLUMNS.ID}`,
      //   `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
      // )
      .leftJoin(
        ACCOUNTMASTER.NAME,
        `${OUTLET_EXPENSES.NAME}.${OUTLET_EXPENSES.COLUMNS.ACC_ID}`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ID}`)
      .whereBetween(`${OUTLET_EXPENSES.NAME}.${OUTLET_EXPENSES.COLUMNS.DOCDATE}`, [body.from_date, body.to_date])
    // .andWhere(builder => {
    //   if (body.docno) {
    //     builder.where(`${OUTLET_EXPENSES.NAME}.${OUTLET_EXPENSES.COLUMNS.DOCNO}`, body.docno);
    //   }
    // });

    if (Number(params.outlet_id) && Number(params.outlet_id) !== 0) {
      query.where(
        `${OUTLET_EXPENSES.NAME}.${OUTLET_EXPENSES.COLUMNS.OUTLET_ID}`,
        Number(params.outlet_id)
      );
    }

    if (Number(params.expenses_name) && Number(params.expenses_name) !== 0) {
      query.where(
        `${OUTLET_EXPENSES.NAME}.${OUTLET_EXPENSES.COLUMNS.ACC_ID}`,
        Number(params.expenses_name)
      );
    }

    // const query = knex.raw(`SELECT a.*
    // FROM outlet_expenses AS a
    // LEFT JOIN heads AS b ON a.id = b.id
    // WHERE a.docdate BETWEEN '2023-12-01' AND '2024-12-01'
    // AND a.docno = 'OEX65'`)

    logQuery({
      logger: fastify.log,
      query,
      context: "Get outlet expenses",
      logTrace
    });

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
    getOutletExpencesReport
  };
}

module.exports = outletExpencesRepo;
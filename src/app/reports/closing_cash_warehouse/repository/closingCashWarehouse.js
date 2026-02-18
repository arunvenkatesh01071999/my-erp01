const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { CLOSINGCASH_WH_MST,
  CLOSINGCASH_WH_DETAILS } = require("../../../closing_cash_warehouse/commons");

const { WAREHOUSE } = require("../../../catalog/commons");


function closingCashWarehouseRepo(fastify) {
  async function getClosingCashWarehouseReport({ body, params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${CLOSINGCASH_WH_MST.NAME}.*`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.WHNAME}`

      ])
      .from(`${CLOSINGCASH_WH_MST.NAME} as ${CLOSINGCASH_WH_MST.NAME}`)
      .leftJoin(
        `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
        `${CLOSINGCASH_WH_MST.NAME}.${CLOSINGCASH_WH_MST.COLUMNS.WAREHOUSE_ID}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
      )


      .whereRaw(
        `DATE(${CLOSINGCASH_WH_MST.NAME}.${CLOSINGCASH_WH_MST.COLUMNS.DATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${CLOSINGCASH_WH_MST.NAME}.${CLOSINGCASH_WH_MST.COLUMNS.DATE}) <= ?`,
        [body.to_date]
      )
      .orderBy(`${CLOSINGCASH_WH_MST.NAME}.${CLOSINGCASH_WH_MST.COLUMNS.ID}`, "DESC");

    if (body.customer && body.customer !== 0) {
      query.where(
        `${CLOSINGCASH_WH_MST.NAME}.${CLOSINGCASH_WH_MST.COLUMNS.WAREHOUSE_ID}`,
        body.customer
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Closing Cash Warehouse",
      logTrace
    });

    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Closing Cash Warehouse Data Not Found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const closingCashDetails = await Promise.all(
      response.map(async closing_cash => {
        const closing_cash_lines = await knex
          .select([
            `${CLOSINGCASH_WH_DETAILS.NAME}.*`
          ])
          .from(`${CLOSINGCASH_WH_DETAILS.NAME} as ${CLOSINGCASH_WH_DETAILS.NAME}`)

          .where(
            `${CLOSINGCASH_WH_DETAILS.NAME}.${CLOSINGCASH_WH_DETAILS.COLUMNS.CLOSING_CASH_WH_MST_ID}`,
            closing_cash.id
          );

        return { ...closing_cash, closing_cash_lines };
      })
    );

    return closingCashDetails;
  }

  return {
    getClosingCashWarehouseReport

  };
}

module.exports = closingCashWarehouseRepo;

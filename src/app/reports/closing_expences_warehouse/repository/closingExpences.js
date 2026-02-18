const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { CLOSINGEXPENCES_WH_MST,
  CLOSINGEXPENCES_WH_DETAILS } = require("../../../closing_expences_warehouse/commons");
const {
  SALESMAN,
  WAREHOUSE
} = require("../../../catalog/commons");


function closingExpencesRepo(fastify) {

  async function closingExpencesWarehouseReport({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${CLOSINGEXPENCES_WH_MST.NAME}.*`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.WHNAME}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.SHORT_NAME}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANCODE}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANNAME}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SHORT_NAME} as sales_man_short_name`
      ])
      .from(`${CLOSINGEXPENCES_WH_MST.NAME} as ${CLOSINGEXPENCES_WH_MST.NAME}`)
      .leftJoin(
        `${SALESMAN.NAME} as ${SALESMAN.NAME}`,
        `${CLOSINGEXPENCES_WH_MST.NAME}.${CLOSINGEXPENCES_WH_MST.COLUMNS.SALESMAN_ID}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.ID}`
      )
      .leftJoin(
        `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
        `${CLOSINGEXPENCES_WH_MST.NAME}.${CLOSINGEXPENCES_WH_MST.COLUMNS.WAREHOUSE_ID}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
      )
      .whereRaw(
        `DATE(${CLOSINGEXPENCES_WH_MST.NAME}.${CLOSINGEXPENCES_WH_MST.COLUMNS.DATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${CLOSINGEXPENCES_WH_MST.NAME}.${CLOSINGEXPENCES_WH_MST.COLUMNS.DATE}) <= ?`,
        [body.to_date]
      )
      .orderBy(`${CLOSINGEXPENCES_WH_MST.NAME}.${CLOSINGEXPENCES_WH_MST.COLUMNS.ID}`, "DESC");

    if (body.warehouse_id && body.warehouse_id !== 0) {
      query.where(
        `${CLOSINGEXPENCES_WH_MST.NAME}.${CLOSINGEXPENCES_WH_MST.COLUMNS.WAREHOUSE_ID}`,
        body.warehouse_id
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Closing Expences",
      logTrace
    });

    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Closing expences warhouse data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const closingExpencesDetails = await Promise.all(
      response.map(async closing_expences => {
        const closing_expences_lines = await knex
          .select([
            `${CLOSINGEXPENCES_WH_DETAILS.NAME}.*`
          ])
          .from(`${CLOSINGEXPENCES_WH_DETAILS.NAME} as ${CLOSINGEXPENCES_WH_DETAILS.NAME}`)

          .where(
            `${CLOSINGEXPENCES_WH_DETAILS.NAME}.${CLOSINGEXPENCES_WH_DETAILS.COLUMNS.CLOSING_EXPENCES_WH_MST_ID}`,
            closing_expences.id
          );

        return { ...closing_expences, closing_expences_lines };
      })
    );

    return closingExpencesDetails;
  }

  return {
    closingExpencesWarehouseReport
  };
}

module.exports = closingExpencesRepo;

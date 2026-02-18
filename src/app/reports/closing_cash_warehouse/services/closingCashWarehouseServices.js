const closingCashWarehouseRepo = require("../repository/closingCashWarehouse.js");

function getClosingCashWarehouseReportService(fastify) {
  const { getClosingCashWarehouseReport } = closingCashWarehouseRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getClosingCashWarehouseReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}


module.exports = {
  getClosingCashWarehouseReportService

};

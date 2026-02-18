const outletSalesRepo = require("../repository/outletSales.js");

function getoutletSalesReturnReportService(fastify) {
  const { getoutletSalesReturnReport } = outletSalesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getoutletSalesReturnReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getoutletSalesReturnReportService
};

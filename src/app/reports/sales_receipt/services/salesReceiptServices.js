const salesReceiptRepo = require("../repository/salesReceipt.js");

function getSalesReceiptReportService(fastify) {
  const { getSalesReceiptReport } = salesReceiptRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSalesReceiptReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}


module.exports = {
  getSalesReceiptReportService
};

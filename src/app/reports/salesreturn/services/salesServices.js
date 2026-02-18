const salesRepo = require("../repository/sales.js");

function getSalesReturnReportService(fastify) {
  const { getSalesReturnReport } = salesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSalesReturnReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getSalesReturnReportService
};

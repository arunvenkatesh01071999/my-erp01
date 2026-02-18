const closingExpencesRepo = require("../repository/closingExpences.js");

function closingExpencesWarehouseReportService(fastify) {
  const { closingExpencesWarehouseReport } = closingExpencesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await closingExpencesWarehouseReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  closingExpencesWarehouseReportService
};

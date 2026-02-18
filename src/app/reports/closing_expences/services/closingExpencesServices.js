const closingExpencesRepo = require("../repository/closingExpences.js");

function getclosingExpencesReportService(fastify) {
  const { getclosingExpencesReport } = closingExpencesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getclosingExpencesReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getclosingExpencesReportService
};

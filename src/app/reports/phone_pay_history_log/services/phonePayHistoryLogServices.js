const phonePayHistoryLogRepo = require("../repository/phonePayHistoryLog.js");

function getPhonePayHistoryLogReportService(fastify) {
  const { getPhonePayHistoryLogReport } = phonePayHistoryLogRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getPhonePayHistoryLogReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getPhonePayHistoryLogReportService
};

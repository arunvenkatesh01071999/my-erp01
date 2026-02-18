const phonePayHistoryLogServices = require("../services/phonePayHistoryLogServices.js");

function phonePayHistoryLogReportHandler(fastify) {
  const getphonePayHistoryLogReport = phonePayHistoryLogServices.getPhonePayHistoryLogReportService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getphonePayHistoryLogReport({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = phonePayHistoryLogReportHandler;

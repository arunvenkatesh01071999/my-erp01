const closingCashServices = require("../services/closingCashServices");

function closingCashReportHandler(fastify) {
  const getclosingCashReport = closingCashServices.getclosingCashReportService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getclosingCashReport({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = closingCashReportHandler;

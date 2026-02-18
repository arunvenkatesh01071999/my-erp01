const closingCashServices = require("../services/closingCashServices");


function getOneClosingCashReportHandler(fastify) {
  const getOneClosingCashReport = closingCashServices.getOneClosingCashReportService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getOneClosingCashReport({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getOneClosingCashReportHandler;

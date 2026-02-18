const salesServices = require("../services/salesServices");

function salesReturnReportHandler(fastify) {
  const getSalesReturnReport = salesServices.getSalesReturnReportService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getSalesReturnReport({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = salesReturnReportHandler;

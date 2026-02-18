const salesReceiptServices = require("../services/salesReceiptServices");

function salesReceiptReportHandler(fastify) {
  const getSalesReceiptReport = salesReceiptServices.getSalesReceiptReportService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getSalesReceiptReport({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = salesReceiptReportHandler;

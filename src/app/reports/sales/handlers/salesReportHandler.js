const salesServices = require("../services/salesServices");

function salesReportHandler(fastify) {
  const getSalesReport = salesServices.getSalesReportService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getSalesReport({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = salesReportHandler;

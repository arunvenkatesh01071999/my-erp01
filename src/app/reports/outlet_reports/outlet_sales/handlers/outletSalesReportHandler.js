const outletSalesServices = require("../services/outletSalesServices");

function outletSalesReportHandler(fastify) {
  const getoutletSalesReport = outletSalesServices.getOutletSalesReportService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getoutletSalesReport({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = outletSalesReportHandler;

const outletSalesServices = require("../services/outletSalesServices");

function outletSalesReturnReportHandler(fastify) {
  const getoutletSalesReturnReport = outletSalesServices.getoutletSalesReturnReportService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getoutletSalesReturnReport({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = outletSalesReturnReportHandler;

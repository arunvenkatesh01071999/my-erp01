const outletSalesServices = require("../services/outletSalesServices");

function outletSalesOutletWiseCurrentDateReportHandler(fastify) {
  const outletSalesOutletWiseCurrentDateReport = outletSalesServices.outletSalesOutletWiseCurrentDateReportService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await outletSalesOutletWiseCurrentDateReport({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = outletSalesOutletWiseCurrentDateReportHandler;

const getDashboardServices = require("../services/getDashboardServices");

function getDashboardStockCatReportHandler(fastify) {
  const getDashboardStockCatReport = getDashboardServices.getDashboardStockCatReportServices(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getDashboardStockCatReport({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getDashboardStockCatReportHandler;

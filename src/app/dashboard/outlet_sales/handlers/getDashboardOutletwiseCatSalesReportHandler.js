const getDashboardServices = require("../services/getDashboardServices");

function getDashboardOutletwiseCatSalesReportHandler(fastify) {
  const getDashboardOutletwiseCatSalesReport = getDashboardServices.getDashboardOutletwiseCatSalesReportServices(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getDashboardOutletwiseCatSalesReport({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getDashboardOutletwiseCatSalesReportHandler;

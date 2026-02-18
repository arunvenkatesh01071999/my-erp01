const getDashboardServices = require("../services/getDashboardServices");

function getDashboardOutletSalesHandler(fastify) {
  const getDashboardOutletSales = getDashboardServices.getDashboardOutletSalesServices(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getDashboardOutletSales({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getDashboardOutletSalesHandler;

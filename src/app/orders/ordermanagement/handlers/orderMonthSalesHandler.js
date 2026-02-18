const getOrderService = require("../services/getOrderServices");

function orderMonthSalesHandler(fastify) {
  const getOrdersBySalesMonth = getOrderService.getOrderBySalesService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getOrdersBySalesMonth({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = orderMonthSalesHandler;

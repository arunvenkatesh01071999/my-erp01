const getOrderService = require("../services/getOrderServices");

function orderYearSalesHandler(fastify) {
  const getOrdersByYear = getOrderService.getOrderByYearService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getOrdersByYear({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = orderYearSalesHandler;

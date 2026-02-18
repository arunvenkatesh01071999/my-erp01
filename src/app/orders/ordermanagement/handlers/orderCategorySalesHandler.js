const getOrderService = require("../services/getOrderServices");

function orderCategorySalesHandler(fastify) {
  const getCategorySales = getOrderService.getCategorySalesService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getCategorySales({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = orderCategorySalesHandler;

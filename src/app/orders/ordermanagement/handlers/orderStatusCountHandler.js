const getOrderService = require("../services/getOrderServices");

function orderStatusCountHandler(fastify) {
  const getOrderStatus = getOrderService.getOrderStatusService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getOrderStatus({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = orderStatusCountHandler;

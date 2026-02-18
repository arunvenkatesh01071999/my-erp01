const getOrderService = require("../services/getOrderServices");

function getOrderHandler(fastify) {
  const getOrder = getOrderService.getOrderService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getOrder({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOrderHandler;

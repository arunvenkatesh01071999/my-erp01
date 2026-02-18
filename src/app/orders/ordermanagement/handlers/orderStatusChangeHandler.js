const getOrderService = require("../services/getOrderServices");

function orderStatusChangeHandler(fastify) {
  const OrderStatusChange = getOrderService.OrderStatusChangeService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await OrderStatusChange({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = orderStatusChangeHandler;

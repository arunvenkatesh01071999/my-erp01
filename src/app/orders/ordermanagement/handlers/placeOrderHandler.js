const placeOrderService = require("../services/placeOrderServices");

function placeOrderHandler(fastify) {
  const placeOrder = placeOrderService(fastify);
  return async (request, reply) => {
    const { body, query, logTrace, userDetails } = request;
    const response = await placeOrder({ body, query, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = placeOrderHandler;

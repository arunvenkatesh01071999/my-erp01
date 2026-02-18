const stateDeliveryService = require("../services/stateDeliveryService");

function statesDeliveryAmountInfoHandler(fastify) {
  const stateDelivery = stateDeliveryService(fastify);
  return async (request, reply) => {
    const { body, logTrace } = request;
    const response = await stateDelivery({ body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = statesDeliveryAmountInfoHandler;

const consumerServices = require("../services/consumerServices");

function getConsumerHandler(fastify) {
  const getConsumer = consumerServices.getConsumerService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getConsumer({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getConsumerHandler;

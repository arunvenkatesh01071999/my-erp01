const consumerServices = require("../services/consumerServices");

function deleteConsumerHandler(fastify) {
  const deleteConsumer = consumerServices.deleteConsumerService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await deleteConsumer({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = deleteConsumerHandler;

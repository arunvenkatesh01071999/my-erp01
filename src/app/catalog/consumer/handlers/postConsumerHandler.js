const consumerServices = require("../services/consumerServices");

function postConsumerHandler(fastify) {
  const postConsumer = consumerServices.postConsumerService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace,userDetails } = request;
    const response = await postConsumer({ params, body, logTrace,userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postConsumerHandler;

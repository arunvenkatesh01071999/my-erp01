const consumerServices = require("../services/consumerServices");

function putConsumerHandler(fastify) {
  const putConsumer = consumerServices.putConsumerService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace,userDetails} = request;
    const response = await putConsumer({ params, body, logTrace,userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putConsumerHandler;

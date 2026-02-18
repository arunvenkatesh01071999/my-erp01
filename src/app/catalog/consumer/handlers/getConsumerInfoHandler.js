const consumerServices = require("../services/consumerServices");

function getConsumerInfoHandler(fastify) {
  const getConsumerInfo = consumerServices.getConsumerInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getConsumerInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getConsumerInfoHandler;

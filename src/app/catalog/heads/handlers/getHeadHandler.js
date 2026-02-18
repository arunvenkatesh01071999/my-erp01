const headServices = require("../services/headServices");

function getHeadHandler(fastify) {
  const getHead = headServices.getHeadService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getHead({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getHeadHandler;

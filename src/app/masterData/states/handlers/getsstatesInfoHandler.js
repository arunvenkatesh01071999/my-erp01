const stateInfoService = require("../services/stateInfoService");

function getsstatesInfoHandler(fastify) {
  const stateInfo = stateInfoService(fastify);
  return async (request, reply) => {
    const { body, logTrace } = request;
    const response = await stateInfo({ body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getsstatesInfoHandler;

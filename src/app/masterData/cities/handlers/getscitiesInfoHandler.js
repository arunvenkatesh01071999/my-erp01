const cityInfoService = require("../services/cityInfoService");

function getscitiesInfoHandler(fastify) {
  const cityInfo = cityInfoService.cityInfoService(fastify);
  return async (request, reply) => {
    const { body, logTrace } = request;
    const response = await cityInfo({ body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getscitiesInfoHandler;

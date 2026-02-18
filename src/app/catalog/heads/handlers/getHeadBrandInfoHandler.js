const headServices = require("../services/headServices");

function getHeadBrandInfoHandler(fastify) {
  const getHeadInfo = headServices.getHeadBrandInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getHeadInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getHeadBrandInfoHandler;

const headServices = require("../services/headServices");

function getHeadInfoHandler(fastify) {
  const getHeadInfo = headServices.getHeadInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getHeadInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getHeadInfoHandler;

const bannerServices = require("../services/bannerServices");

function bannerInfoHandler(fastify) {
  const getBannersInfo = bannerServices.getBannersInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getBannersInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = bannerInfoHandler;

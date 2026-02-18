const bannerServices = require("../services/bannerServices");

function getBannersHandler(fastify) {
  const getBanners = bannerServices.getBannersService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getBanners({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getBannersHandler;

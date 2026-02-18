const bannerServices = require("../services/bannerServices");

function getBannersPaginateHandler(fastify) {
  const getBannersPaginate = bannerServices.getBannersPaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getBannersPaginate({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getBannersPaginateHandler;

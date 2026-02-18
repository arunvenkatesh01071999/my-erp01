const bannerServices = require("../services/bannerServices");

function deleteBannerHandler(fastify) {
  const deleteBanner = bannerServices.deleteBannerService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await deleteBanner({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = deleteBannerHandler;

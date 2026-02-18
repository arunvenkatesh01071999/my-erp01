const bannerServices = require("../services/bannerServices");

function postBannerHandler(fastify) {
  const postBanner = bannerServices.postBannerService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await postBanner({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = postBannerHandler;

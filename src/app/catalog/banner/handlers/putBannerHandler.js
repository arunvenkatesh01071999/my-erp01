const bannerServices = require("../services/bannerServices");

function putPostHandler(fastify) {
  const putBanner = bannerServices.putBannerService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await putBanner({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = putPostHandler;

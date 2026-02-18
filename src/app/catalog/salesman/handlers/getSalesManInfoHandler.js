const SalesManServices = require("../services/salesManServices");

function getSalesManInfoHandler(fastify) {
  const getSalesManInfo = SalesManServices.getSalesManInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getSalesManInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getSalesManInfoHandler;

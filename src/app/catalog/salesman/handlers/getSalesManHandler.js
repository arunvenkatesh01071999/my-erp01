const SalesManServices = require("../services/salesManServices");

function getSalesManHandler(fastify) {
  const getSalesMan = SalesManServices.getSalesManService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getSalesMan({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getSalesManHandler;

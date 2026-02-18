const SalesManServices = require("../services/salesManServices");

function getSalesManPaginateHandler(fastify) {
  const getSalesManPaginate = SalesManServices.getSalesManPaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getSalesManPaginate({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getSalesManPaginateHandler;

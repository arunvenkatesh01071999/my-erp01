const SalesManServices = require("../services/salesManServices");

function getSalesManOutletMappingOnePaginateHandler(fastify) {
  const getSalesManOutletMappingOnePaginate = SalesManServices.getSalesManOutletMappingOnePaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getSalesManOutletMappingOnePaginate({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getSalesManOutletMappingOnePaginateHandler;

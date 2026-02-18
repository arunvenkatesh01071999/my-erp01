const SalesManServices = require("../services/salesManServices");

function getSalesManOutletMappingOneHandler(fastify) {
  const getSalesManOutletMappingOne = SalesManServices.getSalesManOutletMappingOneService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getSalesManOutletMappingOne({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getSalesManOutletMappingOneHandler;

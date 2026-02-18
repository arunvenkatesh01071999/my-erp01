const outletServices = require("../services/outletServices");

function getRegionwiseOutletListHandler(fastify) {
  const getOutletList = outletServices.getRegionwiseOutletListService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await getOutletList({ body, params, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getRegionwiseOutletListHandler;

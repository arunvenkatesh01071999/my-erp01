const outletServices = require("../services/outletServices");

function getPurchaseOrderRegionwiseOutletListHandler(fastify) {
  const getPurchaseOrderRegionwiseOutletList = outletServices.getPurchaseOrderRegionwiseOutletListService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await getPurchaseOrderRegionwiseOutletList({ body, params, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getPurchaseOrderRegionwiseOutletListHandler;

const outletPurchaseService = require("../services/outletPurchaseService");

function updateOutletPurchaseOrderGrnHandler(fastify) {
  const updateOutletPurchaseOrderGrn = outletPurchaseService.updateOutletPurchaseOrderGrnService(fastify);

  return async (request, reply) => {
    const { body, logTrace, userDetails } = request;
    const response = await updateOutletPurchaseOrderGrn({
      body,logTrace, userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = updateOutletPurchaseOrderGrnHandler;

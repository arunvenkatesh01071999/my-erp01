const purchaseGrnServices = require("../services/purchaseOrderServices");

function getPurchaseOrderApprovedPoHandler(fastify) {
  const getPurchaseOrderApprovedPo = purchaseGrnServices.getPurchaseOrderApprovedPoService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getPurchaseOrderApprovedPo({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getPurchaseOrderApprovedPoHandler;

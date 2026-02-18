const purchaseOrderServices = require("../services/fmcgPurchaseOrderServices.js");

function getPurchaseOrderApprovedItemHandler(fastify) {
  const getPurchaseOrderApprovedItem = purchaseOrderServices.getPurchaseOrderApprovedItemService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getPurchaseOrderApprovedItem({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getPurchaseOrderApprovedItemHandler;

const purchaseOrderServices = require("../services/fmcgPurchaseOrderServices.js");

function getPurchaseOrderApprovedPonoHandler(fastify) {
  const getPurchaseOrderApprovedPono = purchaseOrderServices.getPurchaseOrderApprovedPonoService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getPurchaseOrderApprovedPono({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getPurchaseOrderApprovedPonoHandler;

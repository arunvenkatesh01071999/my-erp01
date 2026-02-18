const purchaseOrderServices = require("../services/fmcgPurchaseOrderServices.js");

function getPurchaseOrderPonoHandler(fastify) {
  const getPurchaseOrderPono = purchaseOrderServices.getPurchaseOrderPonoService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await getPurchaseOrderPono({ body, params, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getPurchaseOrderPonoHandler;

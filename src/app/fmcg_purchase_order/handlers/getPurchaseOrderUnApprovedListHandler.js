const purchaseOrderServices = require("../services/fmcgPurchaseOrderServices.js");

function getPurchaseOrderUnApprovedListHandler(fastify) {
  const getPurchaseOrderUnApprovedList = purchaseOrderServices.getPurchaseOrderUnApprovedListService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getPurchaseOrderUnApprovedList({ params, body, logTrace, userDetails, query });
    return reply.code(200).send(response);
  };
}

module.exports = getPurchaseOrderUnApprovedListHandler;

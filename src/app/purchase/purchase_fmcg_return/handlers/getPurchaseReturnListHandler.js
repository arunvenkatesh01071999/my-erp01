const purchaseOrderServices = require("../services/purchaseReturnServices");

function getPurchaseReturnListHandler(fastify) {
  const getPurchaseReturnList = purchaseOrderServices.getPurchaseReturnListService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getPurchaseReturnList({ params, body, logTrace, query, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getPurchaseReturnListHandler;

const purchaseReturnServices = require("../services/purchaseReturnServices");

function getPurchaseReturnEditListHandler(fastify) {
  const getPurchaseReturnEditList = purchaseReturnServices.getPurchaseReturnEditListService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getPurchaseReturnEditList({ params, body, logTrace, userDetails, query });
    return reply.code(200).send(response);
  };
}

module.exports = getPurchaseReturnEditListHandler;

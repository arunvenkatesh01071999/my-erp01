const purchaseReturnService = require("../services/purchaseReturnServices");

function getPurchaseReturnDetailsHandler(fastify) {
  const getPurchaseReturnDetails = purchaseReturnService.getPurchaseReturnService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace } = request;
    const response = await getPurchaseReturnDetails({ body, params, query, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getPurchaseReturnDetailsHandler;

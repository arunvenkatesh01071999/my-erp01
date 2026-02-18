const purchaseReturnService = require("../services/purchaseReturnServices");

function getPurchaseNoDetailsHandler(fastify) {
  const getPurchaseNoDetails = purchaseReturnService.getPurchaseNoDetailsService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace } = request;
    const response = await getPurchaseNoDetails({ body, params, query, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getPurchaseNoDetailsHandler;

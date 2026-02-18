const purchaseService = require("../services/purchaseServices");

function deletePurchaseHanlder(fastify) {
  const deletePurchase = purchaseService.deletePurchaseService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await deletePurchase({ body, params, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deletePurchaseHanlder;

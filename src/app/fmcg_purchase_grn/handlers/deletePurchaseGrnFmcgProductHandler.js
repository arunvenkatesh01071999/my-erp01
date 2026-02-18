const purchaseGrnServices = require("../services/purchaseOrderServices.js");

function deletePurchaseGrnFmcgProductHandler(fastify) {
  const deletePurchaseGrnFmcgProduct = purchaseGrnServices.deletePurchaseGrnFmcgProductService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deletePurchaseGrnFmcgProduct({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deletePurchaseGrnFmcgProductHandler;

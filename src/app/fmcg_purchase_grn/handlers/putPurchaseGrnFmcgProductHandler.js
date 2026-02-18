const purchaseOrderServices = require("../services/purchaseOrderServices.js");

function putPurchaseGrnFmcgProductHandler(fastify) {
  const putPurchaseGrnFmcgProduct = purchaseOrderServices.putPurchaseGrnFmcgProductService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putPurchaseGrnFmcgProduct({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putPurchaseGrnFmcgProductHandler;

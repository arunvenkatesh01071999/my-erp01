const purchaseOrderServices = require("../services/purchaseOrderServices.js");

function postPurchaseGrnFmcgProductHandler(fastify) {
  const postPurchaseGrnFmcgProduct = purchaseOrderServices.postPurchaseGrnFmcgProductService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postPurchaseGrnFmcgProduct({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postPurchaseGrnFmcgProductHandler;

const purchaseOrderServices = require("../services/purchaseOrderServices.js");

function postPurchaseGrnFvProductHandler(fastify) {
  const postPurchaseGrnFvProduct = purchaseOrderServices.postPurchaseGrnFvProductService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postPurchaseGrnFvProduct({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postPurchaseGrnFvProductHandler;

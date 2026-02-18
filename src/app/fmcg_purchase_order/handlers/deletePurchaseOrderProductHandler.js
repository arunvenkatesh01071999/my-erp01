const purchaseOrderServices = require("../services/fmcgPurchaseOrderServices.js");

function deletePurchaseOrderProductHandler(fastify) {
  const deletePurchaseOrderProduct = purchaseOrderServices.deletePurchaseOrderProductService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deletePurchaseOrderProduct({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deletePurchaseOrderProductHandler;

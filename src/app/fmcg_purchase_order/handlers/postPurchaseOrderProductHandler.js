const purchaseOrderServices = require("../services/fmcgPurchaseOrderServices.js");

function postPurchaseOrderProductHandler(fastify) {
  const postPurchaseOrderProduct = purchaseOrderServices.postPurchaseOrderProductService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postPurchaseOrderProduct({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postPurchaseOrderProductHandler;

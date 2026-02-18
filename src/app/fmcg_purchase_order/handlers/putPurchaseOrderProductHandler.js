const purchaseOrderServices = require("../services/fmcgPurchaseOrderServices.js");

function putPurchaseOrderProductHandler(fastify) {
  const putPurchaseOrderProduct = purchaseOrderServices.putPurchaseOrderProductService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putPurchaseOrderProduct({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putPurchaseOrderProductHandler;

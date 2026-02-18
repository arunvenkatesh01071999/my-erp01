const purchaseOrderServices = require("../services/fmcgPurchaseOrderServices.js");

function getProductBySupplierHandler(fastify) {
  const getProductBySupplier = purchaseOrderServices.getProductBySupplierService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getProductBySupplier({ params, body, logTrace, userDetails, query });
    return reply.code(200).send(response);
  };
}

module.exports = getProductBySupplierHandler;

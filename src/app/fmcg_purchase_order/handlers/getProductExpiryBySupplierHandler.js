const purchaseOrderServices = require("../services/fmcgPurchaseOrderServices.js");

function getProductExpiryBySupplierHandler(fastify) {
  const getProductExpiryBySupplier = purchaseOrderServices.getProductExpiryBySupplierService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getProductExpiryBySupplier({ params, body, logTrace, userDetails, query });
    return reply.code(200).send(response);
  };
}

module.exports = getProductExpiryBySupplierHandler;

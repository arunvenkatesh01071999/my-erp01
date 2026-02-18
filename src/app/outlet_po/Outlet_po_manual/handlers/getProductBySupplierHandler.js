const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function getProductBySupplierHandler(fastify) {
  const getProductBySupplier = outletPurchaseOrderServices.getProductBySupplierService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getProductBySupplier({
      params,
      body,
      logTrace,
      userDetails,
      query
    });
    return reply.code(200).send(response);
  };
}

module.exports = getProductBySupplierHandler;

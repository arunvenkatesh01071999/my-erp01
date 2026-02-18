const outletPurchaseService = require("../services/outletPurchaseService");

function getOutletMemoSuppliersHandler(fastify) {
  const getOutletMemoSuppliers = outletPurchaseService.getOutletMemoSuppliersService(fastify);

  return async (request, reply) => {
    const { params, logTrace } = request;
    const response = await getOutletMemoSuppliers({
      params,
      logTrace
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletMemoSuppliersHandler;

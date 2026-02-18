const outletPurchaseService = require("../services/outletPurchaseService");

function getOutletPurchaseSupplierListHandler(fastify) {
  const getOutletPurchaseSupplierList = outletPurchaseService.getOutletPurchaseSupplierListService(fastify);

  return async (request, reply) => {
    const { params, logTrace } = request;
    const response = await getOutletPurchaseSupplierList({
      params,
      logTrace
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletPurchaseSupplierListHandler;

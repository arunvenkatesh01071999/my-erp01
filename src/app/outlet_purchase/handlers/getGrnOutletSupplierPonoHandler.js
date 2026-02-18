const outletPurchaseService = require("../services/outletPurchaseService");

function getGrnOutletSupplierPonoHandler(fastify) {
  const getGrnOutletSupplierPonoService = outletPurchaseService.getGrnOutletSupplierPonoService(fastify);

  return async (request, reply) => {
    const { params, logTrace } = request;
    const response = await getGrnOutletSupplierPonoService({
      params,
      logTrace
    });
    return reply.code(200).send(response);
  };
}

module.exports = getGrnOutletSupplierPonoHandler;

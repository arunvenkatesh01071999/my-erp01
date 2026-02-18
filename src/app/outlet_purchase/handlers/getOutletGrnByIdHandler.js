const outletPurchaseService = require("../services/outletPurchaseService");

function getOutletGrnByIdHandler(fastify) {
  const getOutletGrnByIdService = outletPurchaseService.getOutletGrnByIdService(fastify);

  return async (request, reply) => {
    const { params, logTrace } = request;
    const response = await getOutletGrnByIdService({
      params,
      logTrace
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletGrnByIdHandler;

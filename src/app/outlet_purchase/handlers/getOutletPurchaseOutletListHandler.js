const outletPurchaseService = require("../services/outletPurchaseService");

function getOutletPurchaseOutletListHandler(fastify) {
  const getOutletPurchaseOutletList = outletPurchaseService.getOutletPurchaseOutletListService(fastify);

  return async (request, reply) => {
    const { params, logTrace } = request;
    const response = await getOutletPurchaseOutletList({
      params,
      logTrace
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletPurchaseOutletListHandler;

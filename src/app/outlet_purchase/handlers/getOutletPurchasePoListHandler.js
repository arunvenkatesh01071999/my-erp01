const outletPurchaseService = require("../services/outletPurchaseService");

function getOutletPurchasePoListHandler(fastify) {
  const getOutletPurchasePoList = outletPurchaseService.getOutletPurchasePoListService(fastify);

  return async (request, reply) => {
    const {  body, params, logTrace } = request;
    const response = await getOutletPurchasePoList({
       body, params, logTrace
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletPurchasePoListHandler;

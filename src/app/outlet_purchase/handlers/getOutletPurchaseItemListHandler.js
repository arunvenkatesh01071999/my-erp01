const outletPurchaseService = require("../services/outletPurchaseService");

function getOutletPurchaseItemListHandler(fastify) {
  const getOutletPurchaseItemList = outletPurchaseService.getOutletPurchaseItemListService(fastify);

  return async (request, reply) => {
    const {  body, params, logTrace, query } = request;
    const response = await getOutletPurchaseItemList({
       body, params, logTrace, query
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletPurchaseItemListHandler;

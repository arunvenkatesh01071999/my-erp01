const storeService = require("../services/storeService");

function getStorePurchaseOrderApprovedItemHandler(fastify) {
  const getStorePurchaseOrderApprovedItemService = storeService.getStorePurchaseOrderApprovedItemService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getStorePurchaseOrderApprovedItemService({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getStorePurchaseOrderApprovedItemHandler;

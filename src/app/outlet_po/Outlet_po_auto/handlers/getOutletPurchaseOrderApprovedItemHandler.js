const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function getOutletPurchaseOrderApprovedItemHandler(fastify) {
  const getOutletPurchaseOrderApprovedItem = 
  outletPurchaseOrderServices.getOutletPurchaseOrderApprovedItemService(
      fastify
    );

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getOutletPurchaseOrderApprovedItem({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletPurchaseOrderApprovedItemHandler;

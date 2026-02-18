const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function getOutletPurchaseOrderUnApprovedListHandler(fastify) {
  const getOutletPurchaseOrderUnApprovedList =
    outletPurchaseOrderServices.getOutletPurchaseOrderUnApprovedListService(
      fastify
    );

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getOutletPurchaseOrderUnApprovedList({
      params,
      body,
      logTrace,
      userDetails,
      query
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletPurchaseOrderUnApprovedListHandler;

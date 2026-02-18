const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function deleteOutletPurchaseOrderProductHandler(fastify) {
  const deleteOutletPurchaseOrderProduct =
    outletPurchaseOrderServices.deleteOutletPurchaseOrderProductService(
      fastify
    );

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteOutletPurchaseOrderProduct({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = deleteOutletPurchaseOrderProductHandler;

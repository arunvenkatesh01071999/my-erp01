const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function putOutletPurchaseOrderProductHandler(fastify) {
  const putOutletPurchaseOrderProduct =
    outletPurchaseOrderServices.putOutletPurchaseOrderProductService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putOutletPurchaseOrderProduct({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = putOutletPurchaseOrderProductHandler;

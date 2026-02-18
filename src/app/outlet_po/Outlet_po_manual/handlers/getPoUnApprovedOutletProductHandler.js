const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function getPoUnApprovedOutletProductHandler(fastify) {
  const getPoUnApprovedOutletProduct = outletPurchaseOrderServices.getOutletPoUnApprovedProductService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getPoUnApprovedOutletProduct({ params, body, logTrace, userDetails, query });
    return reply.code(200).send(response);
  };
}

module.exports = getPoUnApprovedOutletProductHandler;

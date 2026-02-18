const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function putOutletPoUnApprovedProductHandler(fastify) {
  const putoutletPoUnApprovedProduct = outletPurchaseOrderServices.putOutletPoUnApprovedProductService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await putoutletPoUnApprovedProduct({ body, params, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putOutletPoUnApprovedProductHandler;

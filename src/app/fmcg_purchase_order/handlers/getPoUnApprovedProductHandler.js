const purchaseOrderServices = require("../services/fmcgPurchaseOrderServices.js");

function getPoUnApprovedProductHandler(fastify) {
  const getPoUnApprovedProduct = purchaseOrderServices.getPoUnApprovedProductService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getPoUnApprovedProduct({ params, body, logTrace, userDetails, query });
    return reply.code(200).send(response);
  };
}

module.exports = getPoUnApprovedProductHandler;

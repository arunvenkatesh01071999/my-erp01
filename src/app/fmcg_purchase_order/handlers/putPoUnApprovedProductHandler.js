const purchaseOrderServices = require("../services/fmcgPurchaseOrderServices.js");

function putPoUnApprovedProductHandler(fastify) {
  const putPoUnApprovedProduct = purchaseOrderServices.putPoUnApprovedProductService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await putPoUnApprovedProduct({ body, params, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putPoUnApprovedProductHandler;

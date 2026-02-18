const purchaseServices = require("../services/purchaseServices");

function putPurchaseDetailsHandler(fastify) {
  const putPurchaseDetails = purchaseServices.putPurchaseDetailsService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putPurchaseDetails({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = putPurchaseDetailsHandler;

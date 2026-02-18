const purchaseServices = require("../services/purchaseServices");

function postpurchaseHandler(fastify) {
  const postpurchase = purchaseServices.postPurchaseDetailsService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postpurchase({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postpurchaseHandler;

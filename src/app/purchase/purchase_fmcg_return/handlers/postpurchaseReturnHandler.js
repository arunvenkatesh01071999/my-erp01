const purchaseServices = require("../services/purchaseReturnServices");

function postpurchaseReturnHandler(fastify) {
  const postpurchase = purchaseServices.postPurchaseReturnService(fastify);

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

module.exports = postpurchaseReturnHandler;

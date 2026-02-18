const outletPurchaseService = require("../services/outletPurchaseService");

function postOutletPurchaseHandler(fastify) {
  const postOutletPurchase = outletPurchaseService.postOutletPurchaseService(fastify);

  return async (request, reply) => {
    const { body, logTrace, userDetails } = request;
    const response = await postOutletPurchase({
      body,logTrace, userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postOutletPurchaseHandler;

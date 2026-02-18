const outletPurchaseService = require("../services/outletPurchaseService");

function postOutletManualPurchaseHandler(fastify) {
  const postOutletManualPurchaseService = outletPurchaseService.postOutletManualPurchaseService(fastify);

  return async (request, reply) => {
    const { body, logTrace, userDetails } = request;
    const response = await postOutletManualPurchaseService({
      body,logTrace, userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postOutletManualPurchaseHandler;

const storeService = require("../services/storeService");

function postStoreManualPurchaseHandler(fastify) {
  const postStoreManualPurchaseService = storeService.postStoreManualPurchaseService(fastify);

  return async (request, reply) => {
    const { body, logTrace, userDetails } = request;
    const response = await postStoreManualPurchaseService({
      body, logTrace, userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postStoreManualPurchaseHandler;

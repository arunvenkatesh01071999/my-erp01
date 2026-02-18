const storeService = require("../services/storeService");

function putStorePurchaseReturnHandler(fastify) {
  const putStorePurchaseReturnService = storeService.putStorePurchaseReturnService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putStorePurchaseReturnService({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = putStorePurchaseReturnHandler;

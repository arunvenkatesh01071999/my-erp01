const storeService = require("../services/storeService");

function postStorepurchaseReturnHandler(fastify) {
  const postStorePurchaseReturnService = storeService.postStorePurchaseReturnService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postStorePurchaseReturnService({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postStorepurchaseReturnHandler;

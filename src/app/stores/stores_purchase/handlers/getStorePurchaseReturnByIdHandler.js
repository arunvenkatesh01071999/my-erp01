const storeService = require("../services/storeService");

function getStorePurchaseReturnByIdHandler(fastify) {
  const getStorePurchaseReturnByIdService = storeService.getStorePurchaseReturnByIdService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getStorePurchaseReturnByIdService({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getStorePurchaseReturnByIdHandler;

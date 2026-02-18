const storeService = require("../services/storeService");

function deleteStorePurchaseReturnHandler(fastify) {
  const deleteStorePurchaseReturnService = storeService.deleteStorePurchaseReturnService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteStorePurchaseReturnService({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = deleteStorePurchaseReturnHandler;

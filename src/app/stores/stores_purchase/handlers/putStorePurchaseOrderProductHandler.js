const storeService = require("../services/storeService");

function putStorePurchaseOrderProductHandler(fastify) {
  const putStorePurchaseOrderProductService = storeService.putStorePurchaseOrderProductService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putStorePurchaseOrderProductService({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putStorePurchaseOrderProductHandler;

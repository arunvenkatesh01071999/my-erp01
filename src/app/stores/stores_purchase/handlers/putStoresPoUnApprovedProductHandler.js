const storeService = require("../services/storeService");

function putStoresPoUnApprovedProductHandler(fastify) {
  const putStorePoUnApprovedProductService = storeService.putStorePoUnApprovedProductService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await putStorePoUnApprovedProductService({ body, params, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putStoresPoUnApprovedProductHandler;

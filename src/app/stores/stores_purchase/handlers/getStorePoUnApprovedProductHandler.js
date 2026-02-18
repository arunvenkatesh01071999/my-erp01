const storeService = require("../services/storeService");

function getStorePoUnApprovedProductHandler(fastify) {
  const getStorePoUnApprovedProductService = storeService.getStorePoUnApprovedProductService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getStorePoUnApprovedProductService({ params, body, logTrace, userDetails, query });
    return reply.code(200).send(response);
  };
}

module.exports = getStorePoUnApprovedProductHandler;

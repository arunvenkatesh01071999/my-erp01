const storeService = require("../services/storeService");

function postStorePoPurchaseHandler(fastify) {
  const postStorePoPurchaseService = storeService.postStorePoPurchaseService(fastify);

  return async (request, reply) => {
    const { body, logTrace, userDetails } = request;
    const response = await postStorePoPurchaseService({
      body, logTrace, userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postStorePoPurchaseHandler;

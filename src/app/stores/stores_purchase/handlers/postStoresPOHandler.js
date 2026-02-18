const storeService = require("../services/storeService");

function postStoresPOHandler(fastify) {
  const postStoresPOService = storeService.postStoresPOService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postStoresPOService({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postStoresPOHandler;

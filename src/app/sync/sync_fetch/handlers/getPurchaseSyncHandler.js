const syncfetchService = require("../services/syncfetchService");

function getPurchaseSyncHandler(fastify) {
  const getPurchaseSyncService = syncfetchService.getPurchaseSyncService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getPurchaseSyncService({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getPurchaseSyncHandler;

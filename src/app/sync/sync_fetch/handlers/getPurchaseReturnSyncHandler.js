const syncfetchService = require("../services/syncfetchService");

function getPurchaseReturnSyncHandler(fastify) {
  const getPurchaseReturnSyncService = syncfetchService.getPurchaseReturnSyncService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getPurchaseReturnSyncService({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getPurchaseReturnSyncHandler;

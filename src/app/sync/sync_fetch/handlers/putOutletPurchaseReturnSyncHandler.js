const syncfetchService = require("../services/syncfetchService");

function putOutletPurchaseReturnSyncHandler(fastify) {
  const putOutletPurchaseReturnSyncService =
    syncfetchService.putOutletPurchaseReturnSyncService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putOutletPurchaseReturnSyncService({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = putOutletPurchaseReturnSyncHandler;

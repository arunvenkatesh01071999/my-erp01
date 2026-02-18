const syncfetchService = require("../services/syncfetchService");

function putOutletPOSyncHandler(fastify) {
  const putOutletPOSyncService =
    syncfetchService.putOutletPOSyncService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putOutletPOSyncService({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = putOutletPOSyncHandler;

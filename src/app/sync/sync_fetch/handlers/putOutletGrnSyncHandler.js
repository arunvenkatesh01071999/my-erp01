const syncfetchService = require("../services/syncfetchService");

function putOutletGrnSyncHandler(fastify) {
  const putOutletGrnSyncService = syncfetchService.putOutletGrnSyncService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putOutletGrnSyncService({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = putOutletGrnSyncHandler;

const syncfetchService = require("../services/syncfetchService");

function putOutletDebitNoteSyncHandler(fastify) {
  const putOutletDebitNoteSyncService = syncfetchService.putOutletDebitNoteSyncService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putOutletDebitNoteSyncService({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = putOutletDebitNoteSyncHandler;

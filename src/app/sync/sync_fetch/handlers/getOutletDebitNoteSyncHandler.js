const syncfetchService = require("../services/syncfetchService");

function getOutletDebitNoteSyncHandler(fastify) {
  const getOutletDebitNoteSyncService = syncfetchService.getOutletDebitNoteSyncService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getOutletDebitNoteSyncService({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletDebitNoteSyncHandler;

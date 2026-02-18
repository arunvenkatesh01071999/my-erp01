const syncfetchService = require("../services/syncfetchService");

function getPosyncHandler(fastify) {
  const getpoSyncPaginateService = syncfetchService.getpoSyncPaginateService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getpoSyncPaginateService({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getPosyncHandler;

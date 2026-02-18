const traymasterService = require("../services/traymasterService");

function getTrayMasterPaginateHandler(fastify) {
  const getTrayMasterPaginate = traymasterService.getTrayMasterPaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getTrayMasterPaginate({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getTrayMasterPaginateHandler;

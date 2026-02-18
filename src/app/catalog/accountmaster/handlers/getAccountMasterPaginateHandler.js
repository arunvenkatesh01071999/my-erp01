const accountMasterService = require("../services/accountMaster");

function getAccountMasterPaginateHandler(fastify) {
  const getAccountMasterPaginate = accountMasterService.getAccountMasterPaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getAccountMasterPaginate({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getAccountMasterPaginateHandler;

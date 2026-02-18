const accountMasterService = require("../services/accountMaster");

function getAccountMasterHandler(fastify) {
  const getaccountMaster = accountMasterService.getAccountMasterService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getaccountMaster({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getAccountMasterHandler;

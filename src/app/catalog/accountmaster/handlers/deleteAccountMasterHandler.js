const accountMasterService = require("../services/accountMaster");

function deleteAccountMasterHandler(fastify) {
  const AccountMaster = accountMasterService.deleteAccountMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await AccountMaster({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = deleteAccountMasterHandler;

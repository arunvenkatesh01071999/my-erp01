const accountMasterService = require("../services/accountMaster");

function putAccountMasterHandler(fastify) {
  const putAccountMaster = accountMasterService.putAccountMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace,userDetails } = request;
    const response = await putAccountMaster({ params, body, logTrace,userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putAccountMasterHandler;

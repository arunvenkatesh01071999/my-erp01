const accountMasterServices = require("../services/accountMaster");

function postAccountMasterHandler(fastify) {
  const postAccountMaster = accountMasterServices.postAccountMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace,userDetails } = request;
    const response = await postAccountMaster({ params, body, logTrace,userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postAccountMasterHandler;

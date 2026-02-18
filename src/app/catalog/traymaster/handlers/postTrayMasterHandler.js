const traymasterService = require("../services/traymasterService");

function postInchargeMasterHandler(fastify) {
  const postInchargeMaster = traymasterService.postTrayMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postInchargeMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postInchargeMasterHandler;

const traymasterService = require("../services/traymasterService");

function putTrayMasterHandler(fastify) {
  const putTrayMaster = traymasterService.putTrayMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putTrayMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putTrayMasterHandler;

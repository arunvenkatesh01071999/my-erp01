const traymasterService = require("../services/traymasterService");

function deleteTrayMasterHandler(fastify) {
  const deleteTrayMaster = traymasterService.deleteTrayMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteTrayMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deleteTrayMasterHandler;

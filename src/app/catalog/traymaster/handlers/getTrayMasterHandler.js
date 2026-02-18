const traymasterService = require("../services/traymasterService");
function getTrayMasterHandler(fastify) {
  const getTrayMaster = traymasterService.getTrayMasterService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getTrayMaster({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getTrayMasterHandler;

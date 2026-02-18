const traymasterService = require("../services/traymasterService");

function getTrayMasterInfoHandler(fastify) {
  const getTrayMasterInfo = traymasterService.getTrayMasterInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getTrayMasterInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getTrayMasterInfoHandler;

const getPayTypeMasterService = require("../services/getPayTypeMasterService");

function getPayTypeMasterHandler(fastify) {
  const getPayTypeMaster = getPayTypeMasterService.getPayTypeMasterService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getPayTypeMaster({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getPayTypeMasterHandler;

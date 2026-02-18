const getPayTypeMasterService = require("../services/getPayTypeMasterService");

function putPayTypeMasterHandler(fastify) {
  const putPayTypeMaster = getPayTypeMasterService.putPayTypeMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putPayTypeMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putPayTypeMasterHandler;

const getPayTypeMasterService = require("../services/getPayTypeMasterService");

function postPayTypeMasterHandler(fastify) {
  const postPayTypeMaster = getPayTypeMasterService.postPayTypeMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postPayTypeMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postPayTypeMasterHandler;

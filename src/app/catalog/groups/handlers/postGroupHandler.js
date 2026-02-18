const groupServices = require("../services/groupServices");

function postGroupHandler(fastify) {
  const postGroup = groupServices.postGroupService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await postGroup({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = postGroupHandler;

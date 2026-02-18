const groupServices = require("../services/groupServices");

function putGroupHandler(fastify) {
  const putGroup = groupServices.putGroupService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await putGroup({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = putGroupHandler;

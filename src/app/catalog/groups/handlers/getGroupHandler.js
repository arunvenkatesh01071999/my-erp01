const groupServices = require("../services/groupServices");

function getGroupHandler(fastify) {
  const getGroup = groupServices.getGroupService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getGroup({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getGroupHandler;

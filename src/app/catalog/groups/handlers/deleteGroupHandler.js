const groupServices = require("../services/groupServices");

function deleteGroupHandler(fastify) {
  const deleteGroup = groupServices.deleteGroupService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await deleteGroup({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = deleteGroupHandler;

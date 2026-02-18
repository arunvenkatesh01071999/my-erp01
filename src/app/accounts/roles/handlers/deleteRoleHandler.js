const roleServices = require("../services/roleServices");

function deleteRoleHandler(fastify) {
  const deleteRole = roleServices.deleteRoleService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteRole({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deleteRoleHandler;

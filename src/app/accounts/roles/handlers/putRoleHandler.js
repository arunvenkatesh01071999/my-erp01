const roleServices = require("../services/roleServices");

function putRoleHandler(fastify) {
  const putRole = roleServices.putRoleService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putRole({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putRoleHandler;

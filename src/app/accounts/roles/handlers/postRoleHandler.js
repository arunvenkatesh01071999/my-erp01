const roleServices = require("../services/roleServices");

function postRoleHandler(fastify) {
  const postRole = roleServices.postRoleService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postRole({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postRoleHandler;

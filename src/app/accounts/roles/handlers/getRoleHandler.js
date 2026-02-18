const roleServices = require("../services/roleServices");

function getRoleHandler(fastify) {
  const getRole = roleServices.getRoleService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getRole({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getRoleHandler;

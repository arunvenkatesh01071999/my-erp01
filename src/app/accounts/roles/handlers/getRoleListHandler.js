const roleServices = require("../services/roleServices");

function getRoleListHandler(fastify) {
  const getRoleList = roleServices.getRoleListService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getRoleList({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getRoleListHandler;

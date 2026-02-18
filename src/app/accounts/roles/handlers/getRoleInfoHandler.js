const roleServices = require("../services/roleServices");

function getRoleInfoHandler(fastify) {
  const getRoleInfo = roleServices.getRoleInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getRoleInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getRoleInfoHandler;

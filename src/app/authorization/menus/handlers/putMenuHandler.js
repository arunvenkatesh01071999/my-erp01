const menuServices = require("../services/menuServices");

function putMenuHandler(fastify) {
  const putMenu = menuServices.putMenuService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await putMenu({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = putMenuHandler;

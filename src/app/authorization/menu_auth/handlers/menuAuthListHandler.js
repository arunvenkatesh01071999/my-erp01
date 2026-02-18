const menuServices = require("../services/menuauthServices");

function menuAuthListHandler(fastify) {
  const menuAuthList = menuServices.menuAuthListService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await menuAuthList({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = menuAuthListHandler;

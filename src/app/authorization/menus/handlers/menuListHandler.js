const menuServices = require("../services/menuServices");

function menuListHandler(fastify) {
  const menuList = menuServices.menuListService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await menuList({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = menuListHandler;

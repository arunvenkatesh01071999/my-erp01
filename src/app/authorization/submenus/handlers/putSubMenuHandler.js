const menuServices = require("../services/submenuServices");

function putSubMenuHandler(fastify) {
  const putSubMenu = menuServices.putSubMenuService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await putSubMenu({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = putSubMenuHandler;

const menuServices = require("../services/submenuServices");

function getSubMenuHandler(fastify) {
  const getSubMenu = menuServices.getSubMenuService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, userDetails, query } = request;
    const response = await getSubMenu({
      body,
      params,
      logTrace,
      query,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getSubMenuHandler;

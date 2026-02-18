const menuServices = require("../services/submenuServices");

function postSubMenuHandler(fastify) {
  const postSubMenu = menuServices.postSubMenuService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await postSubMenu({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postSubMenuHandler;

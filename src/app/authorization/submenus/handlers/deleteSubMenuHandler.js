const menuServices = require("../services/submenuServices");

function deleteSubMenuHandler(fastify) {
  const deleteSubMenu = menuServices.deleteSubMenuService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await deleteSubMenu({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = deleteSubMenuHandler;

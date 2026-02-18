const menuServices = require("../services/menuServices");

function deleteMenuHandler(fastify) {
  const deleteMenu = menuServices.deleteMenuService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await deleteMenu({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = deleteMenuHandler;

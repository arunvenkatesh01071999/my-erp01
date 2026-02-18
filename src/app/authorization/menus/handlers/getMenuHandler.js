const menuServices = require("../services/menuServices");

function getMenuHandler(fastify) {
  const getMenu = menuServices.getMenuService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getMenu({
      body,
      params,
      logTrace,
      query,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getMenuHandler;

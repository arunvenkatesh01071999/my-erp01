const menuServices = require("../services/menuServices");

function postMenuHandler(fastify) {
  const postMenu = menuServices.postMenuService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await postMenu({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postMenuHandler;

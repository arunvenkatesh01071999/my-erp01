const menuServices = require("../services/submenuServices");

function submenuListHandler(fastify) {
  const submenuList = menuServices.submenuListService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await submenuList({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = submenuListHandler;

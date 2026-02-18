const menuServices = require("../services/menuauthServices");

function postMenuAuthHandler(fastify) {
  const postMenuAuth = menuServices.postMenuAuthService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await postMenuAuth({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postMenuAuthHandler;

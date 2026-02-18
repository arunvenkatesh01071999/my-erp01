const adminServices = require("../services/adminServices");

function postAdminUserHandler(fastify) {
  const postAdminUser = adminServices.postAdminUserService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postAdminUser({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postAdminUserHandler;

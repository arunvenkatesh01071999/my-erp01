const adminServices = require("../services/adminServices");

function getAdminUserHandler(fastify) {
  const getAdminUser = adminServices.getAdminUserService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getAdminUser({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getAdminUserHandler;

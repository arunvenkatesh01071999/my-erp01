const adminServices = require("../services/adminServices");

function deleteAdminUserHandler(fastify) {
  const deleteAdminUser = adminServices.deleteAdminUserService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteAdminUser({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deleteAdminUserHandler;

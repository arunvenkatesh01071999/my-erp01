const adminServices = require("../services/adminServices");

function getAdminUserListHandler(fastify) {
  const getAdminUserList = adminServices.getAdminUserListService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getAdminUserList({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getAdminUserListHandler;

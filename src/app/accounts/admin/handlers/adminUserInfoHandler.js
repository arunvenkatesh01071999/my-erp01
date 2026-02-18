const adminServices = require("../services/adminServices");

function adminUserInfoHandler(fastify) {
  const getAdminUserInfo = adminServices.getAdminUserInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await getAdminUserInfo({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = adminUserInfoHandler;

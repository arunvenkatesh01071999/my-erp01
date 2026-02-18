const adminServices = require("../services/adminServices");

function adminLoginHandler(fastify) {
  const adminLogin = adminServices.adminLoginService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await adminLogin({ params, body, logTrace, request });
    return reply.code(200).send(response);
  };
}

module.exports = adminLoginHandler;

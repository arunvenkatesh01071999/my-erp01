const getDashboardServices = require("../services/getDashboardServices");

function getDashboardApiHandler(fastify) {
  const getDashboardApi = getDashboardServices.getDashboardApiServices(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getDashboardApi({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getDashboardApiHandler;

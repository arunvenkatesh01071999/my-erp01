const getOrderByIdService = require("../services/getOrderServices");

function getOrderByIdHandler(fastify) {
  const getOrderById = getOrderByIdService.getOrderByIdService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getOrderById({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOrderByIdHandler;

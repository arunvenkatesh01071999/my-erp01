const postReasonService = require("../services/postReasonService");

function getReasonHandler(fastify) {
  const getReason = postReasonService.getReasonService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, query } = request;
    const response = await getReason({ params, body, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getReasonHandler;

const postReasonService = require("../services/postReasonService");

function putReasonHandler(fastify) {
  const putReason = postReasonService.putReasonService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putReason({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putReasonHandler;

const postReasonServices = require("../services/postReasonService");

function postReasonHandler(fastify) {
  const postReason = postReasonServices.postReasonService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postReason({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postReasonHandler;

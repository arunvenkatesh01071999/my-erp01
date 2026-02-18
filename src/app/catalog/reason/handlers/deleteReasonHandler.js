const postReasonServices = require("../services/postReasonService");

function deleteReasonHandler(fastify) {
  const deleteReason = postReasonServices.deleteReasonService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteReason({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deleteReasonHandler;

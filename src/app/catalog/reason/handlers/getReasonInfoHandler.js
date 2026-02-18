const postReasonService = require("../services/postReasonService");

function getReasonInfoHandler(fastify) {
  const getReasonInfo = postReasonService.getReasonInfoService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await getReasonInfo({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getReasonInfoHandler;

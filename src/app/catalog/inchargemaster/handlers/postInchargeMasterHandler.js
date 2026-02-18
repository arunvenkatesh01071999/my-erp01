const inchargemasterService = require("../services/inchargemasterService");

function postInchargeMasterHandler(fastify) {
  const postInchargeMaster = inchargemasterService.postInchargeMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postInchargeMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postInchargeMasterHandler;

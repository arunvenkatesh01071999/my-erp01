const inchargemasterService = require("../services/inchargemasterService");

function getInchargeMasterHandler(fastify) {
  const getInchargeMaster = inchargemasterService.getInchargeMasterService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getInchargeMaster({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getInchargeMasterHandler;

const inchargemasterService = require("../services/inchargemasterService");

function getInchargeMasterInfoHandler(fastify) {
  const getInchargeMasterInfo = inchargemasterService.getInchargeMasterInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getInchargeMasterInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getInchargeMasterInfoHandler;

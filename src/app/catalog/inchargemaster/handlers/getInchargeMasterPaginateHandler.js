const inchargemasterService = require("../services/inchargemasterService");

function getInchargeMasterPaginateHandler(fastify) {
  const getInchargeMasterPaginate = inchargemasterService.getInchargeMasterPaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getInchargeMasterPaginate({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getInchargeMasterPaginateHandler;

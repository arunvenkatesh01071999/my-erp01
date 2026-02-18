const postSubAccountsService = require("../services/postSubAccountsService");

function getSubAccountsInfoHandler(fastify) {
  const getSubAccountsInfo =
    postSubAccountsService.getSubAccountsInfoService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await getSubAccountsInfo({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getSubAccountsInfoHandler;

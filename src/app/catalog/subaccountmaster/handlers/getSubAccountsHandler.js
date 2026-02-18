const postSubAccountsService = require("../services/postSubAccountsService");

function getSubAccountsHandler(fastify) {
  const getSubAccounts = postSubAccountsService.getSubAccountsService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await getSubAccounts({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getSubAccountsHandler;

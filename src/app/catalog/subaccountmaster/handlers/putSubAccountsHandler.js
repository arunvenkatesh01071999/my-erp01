const postSubAccountsService = require("../services/postSubAccountsService");

function putSubAccountsHandler(fastify) {
  const putSubAccounts = postSubAccountsService.putSubAccountsService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await putSubAccounts({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = putSubAccountsHandler;

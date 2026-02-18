const postSubAccountsServices = require("../services/postSubAccountsService");

function postSubAccountsHandler(fastify) {
  const postSubAccounts =
    postSubAccountsServices.postSubAccountsService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await postSubAccounts({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = postSubAccountsHandler;

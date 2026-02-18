const postSubAccountsServices = require("../services/postSubAccountsService");

function deleteSubAccountsHandler(fastify) {
  const deleteSubAccounts =
    postSubAccountsServices.deleteSubAccountsService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await deleteSubAccounts({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = deleteSubAccountsHandler;

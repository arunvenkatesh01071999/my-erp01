const getTransactionProviderService = require("../services/getTransactionProviderService");

function deleteTransactionProviderHandler(fastify) {
  const TransactionProvider = getTransactionProviderService.deleteTransactionProviderService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await TransactionProvider({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = deleteTransactionProviderHandler;

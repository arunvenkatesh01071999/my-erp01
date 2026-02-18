const getTransactionProviderService = require("../services/getTransactionProviderService");

function getTransactionProviderHandler(fastify) {
  const getTransactionProvider = getTransactionProviderService.getTransactionProviderService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getTransactionProvider({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getTransactionProviderHandler;

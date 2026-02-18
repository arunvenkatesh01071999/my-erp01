const getTransactionProviderService = require("../services/getTransactionProviderService");

function putTransactionProviderHandler(fastify) {
  const putTransactionProvider = getTransactionProviderService.putTransactionProviderService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putTransactionProvider({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putTransactionProviderHandler;

const getTransactionProviderService = require("../services/getTransactionProviderService");

function postTransactionProviderHandler(fastify) {
  const postTransactionProvider = getTransactionProviderService.postTransactionProviderService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postTransactionProvider({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postTransactionProviderHandler;

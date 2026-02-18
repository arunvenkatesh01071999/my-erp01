const getTransactionTypeService = require("../services/getTransactionTypeService");

function deleteTransactionTypeHandler(fastify) {
  const TransactionType = getTransactionTypeService.deleteTransactionTypeService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await TransactionType({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = deleteTransactionTypeHandler;

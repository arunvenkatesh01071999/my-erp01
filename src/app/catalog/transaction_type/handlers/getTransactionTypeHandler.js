const getTransactionTypeService = require("../services/getTransactionTypeService");

function getTransactionTypeHandler(fastify) {
  const getTransactionType = getTransactionTypeService.getTransactionTypeService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getTransactionType({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getTransactionTypeHandler;

const getTransactionTypeService = require("../services/getTransactionTypeService");

function putTransactionTypeHandler(fastify) {
  const putTransactionType = getTransactionTypeService.putTransactionTypeService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putTransactionType({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putTransactionTypeHandler;

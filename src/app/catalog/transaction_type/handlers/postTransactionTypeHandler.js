const getTransactionTypeService = require("../services/getTransactionTypeService");

function postTransactionTypeHandler(fastify) {
  const postTransactionType = getTransactionTypeService.postTransactionTypeService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postTransactionType({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postTransactionTypeHandler;

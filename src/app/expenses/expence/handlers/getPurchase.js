const purchaseService = require("../services/expenceServices");

function getExpense(fastify) {
  const getExpences = purchaseService.getExpensesService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getExpences({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getExpense;

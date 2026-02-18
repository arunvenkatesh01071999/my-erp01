const expencesService = require("../services/expenceServices");

function getExpense(fastify) {
  const getAllExpences = expencesService.getAllExpencesService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getAllExpences({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getExpense;

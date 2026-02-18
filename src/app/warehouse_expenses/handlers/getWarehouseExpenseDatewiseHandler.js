const getWarehouseExpenseServices = require("../services/getWarehouseExpenseServices");

function getWarehouseExpenseDatewiseHandler(fastify) {
  const getWarehouseExpenseDatewise = getWarehouseExpenseServices.getWarehouseExpenseDatewiseService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getWarehouseExpenseDatewise({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getWarehouseExpenseDatewiseHandler;

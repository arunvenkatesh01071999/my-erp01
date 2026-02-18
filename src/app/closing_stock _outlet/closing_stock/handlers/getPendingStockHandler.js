const ClosingStockOutletServices = require("../services/closingStockOutletServices");

function getPendingStockHandler(fastify) {
  const getPendingStock = ClosingStockOutletServices.getPendingStockService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getPendingStock({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getPendingStockHandler;

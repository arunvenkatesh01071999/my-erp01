const ClosingStockOutletServices = require("../services/closingStockOutletServices");

function getPendingStockViewNewHandler(fastify) {
  const getPendingStockViewNew = ClosingStockOutletServices.getPendingStockViewNewService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getPendingStockViewNew({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getPendingStockViewNewHandler;

const ClosingStockOutletServices = require("../services/closingStockOutletServices");

function postPendingStockToCloshingStockHandler(fastify) {
  const postPendingStockToCloshingStock = ClosingStockOutletServices.postPendingStockToCloshingStockService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postPendingStockToCloshingStock({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postPendingStockToCloshingStockHandler;

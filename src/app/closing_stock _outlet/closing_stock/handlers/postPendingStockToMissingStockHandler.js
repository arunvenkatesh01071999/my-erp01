const ClosingStockOutletServices = require("../services/closingStockOutletServices");

function postPendingStockToMissingStockHandler(fastify) {
  const postPendingStockToMissingStock = ClosingStockOutletServices.postPendingStockToMissingStockService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postPendingStockToMissingStock({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postPendingStockToMissingStockHandler;

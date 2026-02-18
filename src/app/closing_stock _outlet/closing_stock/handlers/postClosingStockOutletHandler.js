const ClosingStockOutletServices = require("../services/closingStockOutletServices");

function postClosingStockOutletHandler(fastify) {
  const postClosingStockOutlet = ClosingStockOutletServices.postClosingStockOutletService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postClosingStockOutlet({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postClosingStockOutletHandler;

const getClosingStockOutletServices = require("../services/getClosingStockOutletServices.js");

function postClosingStockOutletHandler(fastify) {
  const postClosingStockOutlet = getClosingStockOutletServices.postClosingStockOutletService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postClosingStockOutlet({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postClosingStockOutletHandler;

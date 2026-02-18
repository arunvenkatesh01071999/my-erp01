const outletClosingStocksServices = require("../services/outletClosingStocksServices");

function postOutletClosingStocksHandler(fastify) {
  const postOutletClosingStocks = outletClosingStocksServices.postOutletClosingStocksService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postOutletClosingStocks({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postOutletClosingStocksHandler;

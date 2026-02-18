const ClosingStockServices = require("../services/ClosingStockServices");

function postClosingStockHandler(fastify) {
  const postClosingStock = ClosingStockServices.postClosingStockService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace,userDetails } = request;
    const response = await postClosingStock({ params, body, logTrace,userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postClosingStockHandler;

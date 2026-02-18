const indentOrderServices = require("../services/indentOrderServices.js");

function getIndentOrderProductMinStockHandler(fastify) {
  const getIndentOrderProductMinStock = indentOrderServices.getIndentOrderProductMinStockService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getIndentOrderProductMinStock({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getIndentOrderProductMinStockHandler;

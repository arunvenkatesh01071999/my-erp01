const indentOrderServices = require("../services/indentOrderServices.js");

function getIndentOrderProductSalesBasedHandler(fastify) {
  const getIndentOrderProductSalesBased = indentOrderServices.getIndentOrderProductSalesBasedService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getIndentOrderProductSalesBased({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getIndentOrderProductSalesBasedHandler;

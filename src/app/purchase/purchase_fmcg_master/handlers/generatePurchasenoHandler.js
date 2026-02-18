const purchaseService = require("../services/purchaseServices");

function generatePurchasenoHandler(fastify) {
  const generatePurchaseno = purchaseService.generatePurchasenoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await generatePurchaseno({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = generatePurchasenoHandler;

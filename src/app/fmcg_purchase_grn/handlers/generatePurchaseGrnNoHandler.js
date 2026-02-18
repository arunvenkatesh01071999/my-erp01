const purchaseGrnServices = require("../services/purchaseOrderServices");

function generatePurchaseGrnNoHandler(fastify) {
  const generatePurchaseGrnNo = purchaseGrnServices.generateGrnNoService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await generatePurchaseGrnNo({ params, body, logTrace, userDetails, query });
    return reply.code(200).send(response);
  };
}

module.exports = generatePurchaseGrnNoHandler;

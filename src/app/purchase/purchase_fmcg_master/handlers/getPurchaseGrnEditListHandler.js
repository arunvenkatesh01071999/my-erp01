const purchaseServices = require("../services/purchaseServices");

function getPurchaseGrnEditListHandler(fastify) {
  const getPurchaseGrnEditList = purchaseServices.getPurchaseGrnEditListService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getPurchaseGrnEditList({ params, body, logTrace, userDetails, query });
    return reply.code(200).send(response);
  };
}

module.exports = getPurchaseGrnEditListHandler;

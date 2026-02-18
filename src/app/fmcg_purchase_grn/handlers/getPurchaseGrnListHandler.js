const purchaseGrnServices = require("../services/purchaseOrderServices");

function getPurchaseGrnListHandler(fastify) {
  const getPurchaseGrnList = purchaseGrnServices.getPurchaseGrnListService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getPurchaseGrnList({ params, body, logTrace, userDetails, query });
    return reply.code(200).send(response);
  };
}

module.exports = getPurchaseGrnListHandler;

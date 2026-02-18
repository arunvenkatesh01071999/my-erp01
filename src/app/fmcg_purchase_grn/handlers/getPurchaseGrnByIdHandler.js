const purchaseGrnServices = require("../services/purchaseOrderServices");

function getPurchaseGrnByIdHandler(fastify) {
  const getPurchaseGrnById = purchaseGrnServices.getPurchaseGrnByIdService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getPurchaseGrnById({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getPurchaseGrnByIdHandler;

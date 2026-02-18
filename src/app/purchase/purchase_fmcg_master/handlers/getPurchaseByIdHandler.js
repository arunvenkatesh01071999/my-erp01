const purchaseServices = require("../services/purchaseServices");

function getPurchaseByIdHandler(fastify) {
  const getPurchaseGrnById = purchaseServices.getPurchaseByIdService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getPurchaseGrnById({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getPurchaseByIdHandler;

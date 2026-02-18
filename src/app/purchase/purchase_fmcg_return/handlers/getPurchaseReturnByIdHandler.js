const purchaseReturnServices = require("../services/purchaseReturnServices");

function getPurchaseReturnByIdHandler(fastify) {
  const getPurchaseReturnById = purchaseReturnServices.getPurchaseReturnByIdService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getPurchaseReturnById({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getPurchaseReturnByIdHandler;

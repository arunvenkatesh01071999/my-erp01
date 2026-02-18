const purchaseOrderServices = require("../services/purchaseReturnServices");

function getPurchaseBillwiseDetailsHandler(fastify) {
  const getPurchaseBillwiseDetails = purchaseOrderServices.getPurchaseBillwiseDetailsService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getPurchaseBillwiseDetails({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getPurchaseBillwiseDetailsHandler;

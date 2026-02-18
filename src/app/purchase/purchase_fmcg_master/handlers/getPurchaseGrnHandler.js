const purchaseService = require("../services/purchaseServices");

function getPurchaseGrnHandler(fastify) {
  const getPurchaseGrn = purchaseService.getPurchaseGrnService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getPurchaseGrn({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getPurchaseGrnHandler;

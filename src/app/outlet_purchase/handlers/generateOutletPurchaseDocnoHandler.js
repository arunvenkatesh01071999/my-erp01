const outletPurchaseService = require("../services/outletPurchaseService");

function generateOutletPurchaseDocnoHandler(fastify) {
  const getOutletPurchaseDocno = outletPurchaseService.generateOutletPurchaseDocnoService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await getOutletPurchaseDocno({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = generateOutletPurchaseDocnoHandler;

const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function getOutletPoPonoHandler(fastify) {
  const getPurchaseOrderPono =
    outletPurchaseOrderServices.getOutletPoPonoSerevice(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await getPurchaseOrderPono({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletPoPonoHandler;

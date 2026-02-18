const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function updateOutletDsdPoSendBackToFinanceHandler(fastify) {
  const updateOutletDsdPoSendBackToFinance =
    outletPurchaseOrderServices.updateOutletDsdPoSendBackToFinanceService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await updateOutletDsdPoSendBackToFinance({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = updateOutletDsdPoSendBackToFinanceHandler;

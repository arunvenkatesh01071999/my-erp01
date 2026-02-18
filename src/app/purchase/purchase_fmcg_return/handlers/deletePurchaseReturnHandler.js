const purchaseReturnServices = require("../services/purchaseReturnServices");

function deletePurchaseReturnHandler(fastify) {
  const putPurchaseReturn = purchaseReturnServices.deletePurchaseReturnService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putPurchaseReturn({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = deletePurchaseReturnHandler;

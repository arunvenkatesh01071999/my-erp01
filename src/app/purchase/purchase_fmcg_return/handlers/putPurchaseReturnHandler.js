const purchaseReturnServices = require("../services/purchaseReturnServices");

function putPurchaseReturnHandler(fastify) {
  const putPurchaseReturn = purchaseReturnServices.putPurchaseReturnService(fastify);

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

module.exports = putPurchaseReturnHandler;

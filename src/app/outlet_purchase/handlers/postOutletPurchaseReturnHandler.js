const outletPurchaseServices = require("../services/outletPurchaseService");

function postOutletPurchaseReturnHandler(fastify) {
  const postOutletPurchaseReturn = outletPurchaseServices.postOutletPurchaseReturnService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postOutletPurchaseReturn({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postOutletPurchaseReturnHandler;

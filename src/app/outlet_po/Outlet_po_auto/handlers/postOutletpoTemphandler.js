const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function postOutletpoTemphandler(fastify) {
  const postOutletPurchaseOrderProductTempService =
    outletPurchaseOrderServices.postOutletPurchaseOrderProductTempService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postOutletPurchaseOrderProductTempService({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postOutletpoTemphandler;

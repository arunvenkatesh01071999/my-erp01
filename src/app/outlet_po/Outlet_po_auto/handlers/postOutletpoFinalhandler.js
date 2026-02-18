const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function postOutletpoFinalhandler(fastify) {
  const postOutletPurchaseOrderProductFinalService =
    outletPurchaseOrderServices.postOutletPurchaseOrderProductFinalService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postOutletPurchaseOrderProductFinalService({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postOutletpoFinalhandler;

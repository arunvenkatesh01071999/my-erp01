const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function putOutletPoApprovedHandler(fastify) {
  const putOutletPoApproved = outletPurchaseOrderServices.putOutletPoApprovedService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await putOutletPoApproved({ body, params, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putOutletPoApprovedHandler;

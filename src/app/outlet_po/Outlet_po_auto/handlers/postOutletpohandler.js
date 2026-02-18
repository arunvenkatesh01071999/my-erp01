const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function postOutletpohandler(fastify) {
  const postOutletPurchaseOrderProduct =
    outletPurchaseOrderServices.postOutletPurchaseOrderProductService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postOutletPurchaseOrderProduct({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postOutletpohandler;

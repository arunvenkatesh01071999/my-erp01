const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function putOutletPoQtyUpdateHandler(fastify) {
  const putOutletPoQtyUpdate = outletPurchaseOrderServices.putOutletPoQtyUpdateService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await putOutletPoQtyUpdate({ body, params, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putOutletPoQtyUpdateHandler;

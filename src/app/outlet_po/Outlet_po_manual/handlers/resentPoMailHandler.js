const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function resentPoMailHandler(fastify) {
  const resentPoMailservice = outletPurchaseOrderServices.resentPoMailservice(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await resentPoMailservice({ body, params, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = resentPoMailHandler;

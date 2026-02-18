const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function getautogeneratepohandler(fastify) {
  const getautopo =
    outletPurchaseOrderServices.getautopogenerateService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getautopo({
      params,
      body,
      logTrace,
      userDetails,
      query
    });
    return reply.code(200).send(response);
  };
}

module.exports = getautogeneratepohandler;

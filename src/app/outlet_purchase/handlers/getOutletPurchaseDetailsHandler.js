const outletPurchaseService = require("../services/outletPurchaseService");

function getOutletPurchaseDetailsHandler(fastify) {
  const getOutletPurchaseDetails = outletPurchaseService.getOutletPurchaseDetailsService(fastify);

  return async (request, reply) => {
    const {  body, params, logTrace, query } = request;
    const response = await getOutletPurchaseDetails({
       body, params, logTrace, query
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletPurchaseDetailsHandler;

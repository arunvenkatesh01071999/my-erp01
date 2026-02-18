const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function getOutletDsdPoStatusListWithEmailHandler(fastify) {
  const getOutletDsdPoStatusListWithEmail = outletPurchaseOrderServices.getOutletDsdPoStatusListWithEmailService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getOutletDsdPoStatusListWithEmail({
      params,
      body,
      logTrace,
      userDetails,
      query
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletDsdPoStatusListWithEmailHandler;

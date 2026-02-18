const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function getOutletDsdPoStatusListHandler(fastify) {
  const getOutletDsdPoStatusList = outletPurchaseOrderServices.getOutletDsdPoStatusListService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getOutletDsdPoStatusList({
      params,
      body,
      logTrace,
      userDetails,
      query
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletDsdPoStatusListHandler;

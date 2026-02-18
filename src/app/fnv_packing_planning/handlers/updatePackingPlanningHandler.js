const fnvPackingPlanningService = require("../services/fnvPackingPlanningService");

function updatePackingPlanningHandler(fastify) {
  const updatePackingPlanning =
    fnvPackingPlanningService.updatePackingPlanningService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await updatePackingPlanning({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = updatePackingPlanningHandler;

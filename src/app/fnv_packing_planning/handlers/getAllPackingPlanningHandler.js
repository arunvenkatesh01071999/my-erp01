const fnvPackingPlanningService = require("../services/fnvPackingPlanningService");

function getAllPackingPlanningHandler(fastify) {
  const getAllPackingPlanning =
    fnvPackingPlanningService.getAllPackingPlanningService(fastify);

  return async function (request, reply) {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getAllPackingPlanning({
      params,
      body,
      logTrace,
      userDetails,
      query
    });
    return reply.code(200).send(response);
  };
}

module.exports = getAllPackingPlanningHandler;

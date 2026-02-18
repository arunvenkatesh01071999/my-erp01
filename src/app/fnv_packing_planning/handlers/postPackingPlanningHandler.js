const fnvPackingPlanningService = require("../services/fnvPackingPlanningService");

function postPlanningHandler(fastify) {
  const postPackingPlanning =
    fnvPackingPlanningService.postPackingPlanningService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postPackingPlanning({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postPlanningHandler;

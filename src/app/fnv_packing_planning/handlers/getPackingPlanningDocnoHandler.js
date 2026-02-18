const fnvPackingPlanningService = require("../services/fnvPackingPlanningService");

function getPackingPlanningDocnoHandler(fastify) {
  const getPackingPlanningDocno =
    fnvPackingPlanningService.getPackingPlanningDocnoService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getPackingPlanningDocno({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getPackingPlanningDocnoHandler;

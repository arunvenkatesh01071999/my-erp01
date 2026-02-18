const fnvPackingPlanningService = require("../services/fnvPackingPlanningService");

function getPackingPlanningByIdHandler(fastify) {
  const getService = fnvPackingPlanningService.getPackingPlanningByIdService(fastify);

  return async function (request, reply) {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getService({
      params,
      body,
      logTrace,
      userDetails,
      query
    });
    return reply.code(200).send(response);
  };
}

module.exports = getPackingPlanningByIdHandler;

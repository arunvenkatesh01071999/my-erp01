const fnvPackingPlanningService = require("../services/fnvPackingPlanningService");

function getChildItemHandler(fastify) {
  const listChildItemByParentId =
    fnvPackingPlanningService.listChildItemByParentIdService(fastify);

  return async function (request, reply) {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await listChildItemByParentId({
      params,
      body,
      logTrace,
      userDetails,
      query
    });
    return reply.code(200).send(response);
  };
}

module.exports = getChildItemHandler;

const fnvPackingPlanningService = require("../services/fnvPackingPlanningService");

function getAllBulkParentItemHandler(fastify) {
  const getAllBulkParentItem =
    fnvPackingPlanningService.getAllBulkParentItemService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getAllBulkParentItem({
      params,
      body,
      logTrace,
      userDetails,
      query
    });
    return reply.code(200).send(response);
  };
}

module.exports = getAllBulkParentItemHandler;

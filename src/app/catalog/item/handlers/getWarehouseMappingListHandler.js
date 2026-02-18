const itemServices = require("../services/itemServices");

function getWarehouseMappingListHandler(fastify) {
  const getWarehouseMappingList = itemServices.getWarehouseMappingListService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, userDetails, query } = request;
    const response = await getWarehouseMappingList({ body, params, logTrace, query, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getWarehouseMappingListHandler;

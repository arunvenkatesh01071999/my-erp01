const wareHouseServices = require("../services/wareHouseServices");

function getWarehouseListByIdHandler(fastify) {
  const getWarehouseListById = wareHouseServices.getWarehouseListByIdService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query, userDetails } = request;
    const response = await getWarehouseListById({ body, params, logTrace, query, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getWarehouseListByIdHandler;

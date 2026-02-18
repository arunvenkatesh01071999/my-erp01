const wareHouseServices = require("../services/wareHouseServices");

function getWarehouseProductHandler(fastify) {
  const getWarehouseProduct = wareHouseServices.getWarehouseProductService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getWarehouseProduct({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getWarehouseProductHandler;

const itemServices = require("../services/itemServices");

function getSubWarehouseStocksHandler(fastify) {
  const getSubWarehouseStocks = itemServices.getSubWarehouseStocksService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getSubWarehouseStocks({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getSubWarehouseStocksHandler;

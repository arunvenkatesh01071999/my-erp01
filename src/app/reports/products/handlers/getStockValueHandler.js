const ItemServices = require("../services/itemServices");

function getStockValueHandler(fastify) {
  const getStockValue = ItemServices.getStockValueService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getStockValue({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getStockValueHandler;

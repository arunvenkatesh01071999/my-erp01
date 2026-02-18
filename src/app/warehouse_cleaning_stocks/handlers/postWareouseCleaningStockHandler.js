const getWareouseCleaningStockService = require("../services/getWareouseCleaningStockService");

function postWarehouseCleaningStockHandler(fastify) {
  const postWarehouseCleaningStock = getWareouseCleaningStockService.postWareouseCleaningStockService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await postWarehouseCleaningStock({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postWarehouseCleaningStockHandler;

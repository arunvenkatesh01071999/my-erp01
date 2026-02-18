const getClosingStockOutletServices = require("../services/getClosingStockOutletServices.js");

function postClosingStockWarehouseHandler(fastify) {
  const postClosingStockWarehouse = getClosingStockOutletServices.postClosingStockWarehouseService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postClosingStockWarehouse({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postClosingStockWarehouseHandler;

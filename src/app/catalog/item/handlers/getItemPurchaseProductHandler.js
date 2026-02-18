const itemServices = require("../services/itemServices");

function getItemPurchaseProductHandler(fastify) {
  const getItemPurchaseProduct = itemServices.getItemPurchaseProductService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getItemPurchaseProduct({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getItemPurchaseProductHandler;

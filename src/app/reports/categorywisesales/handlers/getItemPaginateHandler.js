const ItemServices = require("../services/itemServices");

function getCategoryWiseHandler(fastify) {
  const getItemPaginate = ItemServices.getCategoryWisePaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getItemPaginate({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getCategoryWiseHandler;

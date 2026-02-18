const ItemServices = require("../services/itemServices");

function getItemPaginateHandler(fastify) {
  const getItemPaginate = ItemServices.getItemPaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getItemPaginate({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getItemPaginateHandler;

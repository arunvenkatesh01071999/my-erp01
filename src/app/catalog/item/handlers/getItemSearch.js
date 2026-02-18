const ItemServices = require("../services/itemServices");

function getItemSearch(fastify) {
  const getItemsSearch = ItemServices.getItemSearchService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getItemsSearch({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getItemSearch;

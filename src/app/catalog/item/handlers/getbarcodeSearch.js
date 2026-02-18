const ItemServices = require("../services/itemServices");

function getBarcodeSearch(fastify) {
  const getItemsSearch = ItemServices.getBarcodeSearchService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getItemsSearch({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getBarcodeSearch;

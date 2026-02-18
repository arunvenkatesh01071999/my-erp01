const ItemServices = require("../services/itemServices");

function getClosingStockBarcodeSearch(fastify) {
    const getItemsSearchClosingStock = ItemServices.getBarcodeSearchClosingStockService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getItemsSearchClosingStock({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getClosingStockBarcodeSearch;

const ItemServices = require("../services/itemServices");

function skuPriceListHandler(fastify) {
    const skuPriceList = ItemServices.skuPriceListService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await skuPriceList({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = skuPriceListHandler;

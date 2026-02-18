const ItemServices = require("../services/itemServices");

function updatePricePoHandler(fastify) {
    const updatePricePo = ItemServices.updatePricePoService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await updatePricePo({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = updatePricePoHandler;

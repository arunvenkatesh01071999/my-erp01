const ItemServices = require("../services/itemServices");

function getItemDetailsOutletsSalesProductHandler(fastify) {
    const getItemDetailsOutletsSalesProduct = ItemServices.getItemDetailsOutletsSalesProductService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getItemDetailsOutletsSalesProduct({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getItemDetailsOutletsSalesProductHandler;

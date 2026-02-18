const SalesManServices = require("../services/salesManServices");

function getSalesManOutletMappingHandler(fastify) {
    const getSalesManOutletMapping = SalesManServices.getSalesManOutletMappingService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getSalesManOutletMapping({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getSalesManOutletMappingHandler;

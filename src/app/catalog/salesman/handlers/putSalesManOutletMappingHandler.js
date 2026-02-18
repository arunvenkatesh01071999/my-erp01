const SalesManServices = require("../services/salesManServices");

function putSalesManOutletMappingHandler(fastify) {
    const putSalesManOutletMapping = SalesManServices.putSalesManOutletMappingService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await putSalesManOutletMapping({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = putSalesManOutletMappingHandler;

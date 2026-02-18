const SalesManServices = require("../services/salesManServices");

function postSalesManOutletMappingHandler(fastify) {
    const postSalesManOutletMapping = SalesManServices.postSalesManOutletMappingService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, files } = request;
        const response = await postSalesManOutletMapping({ params, body, logTrace, userDetails, files });
        return reply.code(200).send(response);
    };
}

module.exports = postSalesManOutletMappingHandler;

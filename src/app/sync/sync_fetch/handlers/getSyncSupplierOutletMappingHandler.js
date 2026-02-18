const syncfetchService = require("../services/syncfetchService");


function getSyncSupplierOutletMappingHandler(fastify) {
    const getSyncSupplierOutletMapping = syncfetchService.getSyncSupplierOutletMappingService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await getSyncSupplierOutletMapping({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getSyncSupplierOutletMappingHandler;

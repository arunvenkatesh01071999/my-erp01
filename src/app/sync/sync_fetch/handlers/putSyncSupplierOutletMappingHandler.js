const syncfetchService = require("../services/syncfetchService");


function putSyncSupplierOutletMappingHandler(fastify) {
    const putSyncSupplierOutletMapping = syncfetchService.putSyncSupplierOutletMappingService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await putSyncSupplierOutletMapping({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = putSyncSupplierOutletMappingHandler;

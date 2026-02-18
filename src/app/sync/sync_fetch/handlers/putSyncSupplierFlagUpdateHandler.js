const syncfetchService = require("../services/syncfetchService");


function putSyncSupplierFlagUpdateHandler(fastify) {
    const putSyncSupplierFlagUpdate = syncfetchService.putSyncSupplierFlagUpdateService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await putSyncSupplierFlagUpdate({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = putSyncSupplierFlagUpdateHandler;

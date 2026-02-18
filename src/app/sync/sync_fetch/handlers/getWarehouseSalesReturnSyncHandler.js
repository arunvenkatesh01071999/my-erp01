const syncfetchService = require("../services/syncfetchService");

function getWarehouseSalesReturnSyncHandler(fastify) {
    const getWarehouseSalesReturnSync = syncfetchService.getWarehouseSalesReturnSyncService(fastify);

    return async (request, replay) => {
        const { params, logTarce, query } = request;
        const response = await getWarehouseSalesReturnSync({
            params,
            logTarce,
            query
        });
        return replay.code(200).send(response);
    }
}

module.exports = getWarehouseSalesReturnSyncHandler;
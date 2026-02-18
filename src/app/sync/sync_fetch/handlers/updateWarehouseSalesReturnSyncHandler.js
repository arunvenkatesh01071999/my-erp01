const syncfetchService = require("../services/syncfetchService");

function updateWarehouseSalesReturnSyncHandler(fastify) {
    const updateWarehouseSalesReturnSync = syncfetchService.updateWarehouseSalesReturnSyncService(fastify);

    return async (request, replay) => {
        const { params, logTarce, query } = request;
        const response = await updateWarehouseSalesReturnSync({
            params,
            logTarce,
            query
        });
        return replay.code(200).send(response);
    }
}

module.exports = updateWarehouseSalesReturnSyncHandler;
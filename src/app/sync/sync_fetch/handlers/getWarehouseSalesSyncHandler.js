const syncfetchService = require("../services/syncfetchService");

function getWarehouseSalesSyncHandler(fastify) {
    const getWarehouseSalesSync = syncfetchService.getWarehouseSalesSyncService(fastify);

    return async (request, replay) => {
        const { params, logTarce, query } = request;
        const response = await getWarehouseSalesSync({
            params,
            logTarce,
            query
        });
        return replay.code(200).send(response);
    }
}

module.exports = getWarehouseSalesSyncHandler;
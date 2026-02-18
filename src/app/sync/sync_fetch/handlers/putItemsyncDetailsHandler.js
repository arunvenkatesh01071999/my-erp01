const syncfetchService = require("../services/syncfetchService");

function putItemsyncDetailsHandler(fastify) {
    const putProductMasterSyncDetails = syncfetchService.putProductMasterSyncDetailsService(fastify);

    return async (request, replay) => {
        const {params, body, query, logTrace, userDetails} = request;
        const response = await putProductMasterSyncDetails({
           params, body, query, logTrace, userDetails
        });
        return replay.code(200).send(response);
    }
}

module.exports = putItemsyncDetailsHandler;
const syncfetchService = require("../services/syncfetchService");

function getProductMasterDetailsHandler(fastify) {
    const getProductMasterDetails = syncfetchService.getProductMasterSyncDetailsService(fastify);

    return async (request, replay) => {
        const { userDetails,params } = request;
        const response = await getProductMasterDetails({
            userDetails,
            params
        });
        return replay.code(200).send(response);
    }
}

module.exports = getProductMasterDetailsHandler;
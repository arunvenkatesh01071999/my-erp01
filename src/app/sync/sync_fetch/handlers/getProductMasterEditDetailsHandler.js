const syncfetchService = require("../services/syncfetchService");

function getProductMasterEditDetailsHandler(fastify) {
    const getProductMasterEditDetails = syncfetchService.getProductMasterEditSyncDetailsService(fastify);

    return async (request, replay) => {
        const { userDetails, params } = request;
        const response = await getProductMasterEditDetails({
            userDetails,
            params
        });
        return replay.code(200).send(response);
    }
}

module.exports = getProductMasterEditDetailsHandler;
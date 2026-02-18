const syncfetchService = require("../services/syncfetchService");

function getItemBarcodeDetailsHandler(fastify) {
    const getItemBarcodeDetails = syncfetchService.getItemBarcodeSyncDetailsService(fastify);

    return async (request, replay) => {
        const { userDetails, params } = request;
        const response = await getItemBarcodeDetails({
            userDetails,
            params
        });
        return replay.code(200).send(response);
    }
}

module.exports = getItemBarcodeDetailsHandler;
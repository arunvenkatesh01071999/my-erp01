const itemService = require("../services/itemService");

function getItemDetailsSyncHanlder(fastify) {
    const getItemDetails = itemService.getItemSyncDetailsService(fastify);

    return async (request, replay) => {
        const { params, logTarce } = request;
        const response = await getItemDetails({
            params,
            logTarce
        });
        return replay.code(200).send(response);
    }
}

module.exports = getItemDetailsSyncHanlder;
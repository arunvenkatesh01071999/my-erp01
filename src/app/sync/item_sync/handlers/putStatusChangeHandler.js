const itemService = require("../services/itemService");

function putItemStatusHanlder(fastify) {
    const putItemDetails = itemService.putitemStatusService(fastify);

    return async (request, replay) => {
        const { params, logTarce, body } = request;
        const response = await putItemDetails({
            params,
            logTarce,
            body
        });
        return replay.code(200).send(response);
    }
}

module.exports = putItemStatusHanlder;
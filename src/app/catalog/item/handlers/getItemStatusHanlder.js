const itemService = require("../services/itemServices");

function getItemStatusHanlder(fastify) {
    const getItemImportStatus = itemService.getitemStatusService(fastify);
    return async (request, replay) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await getItemImportStatus({
            params,
            body,
            logTrace,
            userDetails
        })

        return replay.code(200).send(response);
    }

}

module.exports = getItemStatusHanlder;
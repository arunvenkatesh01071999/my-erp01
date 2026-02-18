const syncfetchService = require("../services/syncfetchService");

function getRedetailsHandler(fastify) {
    const getReDetailsService = syncfetchService.getReDetailsService(fastify);

    return async (request, replay) => {
        const { params, logTarce, body, query,userDetails } = request;
        const response = await getReDetailsService({
            params,
            logTarce,
            body,
            query,
            userDetails
        });
        return replay.code(200).send(response);
    }
}

module.exports = getRedetailsHandler;
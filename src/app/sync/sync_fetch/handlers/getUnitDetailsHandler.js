const syncfetchService = require("../services/syncfetchService");

function getUnitDetailsHandler(fastify) {
    const getUnitDetails = syncfetchService.getUnitDetailsService(fastify);

    return async (request, replay) => {
        const { params, logTarce, query } = request;
        const response = await getUnitDetails({
            params,
            logTarce,
            query
        });
        return replay.code(200).send(response);
    }
}

module.exports = getUnitDetailsHandler;
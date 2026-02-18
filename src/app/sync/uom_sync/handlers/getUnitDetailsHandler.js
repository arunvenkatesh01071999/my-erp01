const unitService = require("../services/unitService");

function getUnitDetailsSyncHanlder(fastify) {
    const getUnitDetails = unitService.getUnitSyncDetailsService(fastify);

    return async (request, replay) => {
        const { params, logTarce } = request;
        const response = await getUnitDetails({
            params,
            logTarce
        });
        return replay.code(200).send(response);
    }
}

module.exports = getUnitDetailsSyncHanlder;
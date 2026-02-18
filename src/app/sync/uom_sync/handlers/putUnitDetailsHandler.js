const unitService = require("../services/unitService");

function putUnitsSyncHanlder(fastify) {
    const putUnitsDetails = unitService.putUnitsSyncDetailsService(fastify);

    return async (request, replay) => {
        const { params, logTarce, body } = request;
        const response = await putUnitsDetails({
            params,
            logTarce,
            body
        });
        return replay.code(200).send(response);
    }
}

module.exports = putUnitsSyncHanlder;
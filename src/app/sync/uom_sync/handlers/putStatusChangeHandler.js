const unitService = require("../services/unitService");

function putUnitsStatusHanlder(fastify) {
    const putUnitsDetails = unitService.putUnitsStatusService(fastify);

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

module.exports = putUnitsStatusHanlder;
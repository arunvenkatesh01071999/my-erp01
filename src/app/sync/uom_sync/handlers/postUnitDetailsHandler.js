const unitsService = require("../services/unitService");

function postUnitsSyncHanlder(fastify) {
    const postUnitsDetails = unitsService.postUnitsService(fastify);

    return async (request, replay) => {
        const { userDetails } = request;
        const response = await postUnitsDetails({
            userDetails
        });
        return replay.code(200).send(response);
    }
}

module.exports = postUnitsSyncHanlder;
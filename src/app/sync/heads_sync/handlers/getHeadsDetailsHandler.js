const headsService = require("../services/headsService");

function getHeadsDetailsSyncHanlder(fastify) {
    const getHeadsDetails = headsService.getHeadsSyncDetailsService(fastify);

    return async (request, replay) => {
        const { params, logTarce } = request;
        const response = await getHeadsDetails({
            params,
            logTarce
        });
        return replay.code(200).send(response);
    }
}

module.exports = getHeadsDetailsSyncHanlder;
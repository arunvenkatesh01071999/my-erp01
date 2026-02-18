const headsService = require("../services/headsService");

function putHeadsSyncHanlder(fastify) {
    const putHeadsDetails = headsService.putHeadsSyncDetailsService(fastify);

    return async (request, replay) => {
        const { params, logTarce, body } = request;
        const response = await putHeadsDetails({
            params,
            logTarce,
            body
        });
        return replay.code(200).send(response);
    }
}

module.exports = putHeadsSyncHanlder;
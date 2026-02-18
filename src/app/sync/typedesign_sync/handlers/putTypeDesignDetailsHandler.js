const typedesignService = require("../services/typedesignService");

function putHeadsSyncHanlder(fastify) {
    const putTypeDesignDetails = typedesignService.putTypeDesignSyncDetailsService(fastify);

    return async (request, replay) => {
        const { params, logTarce, body } = request;
        const response = await putTypeDesignDetails({
            params,
            logTarce,
            body
        });
        return replay.code(200).send(response);
    }
}

module.exports = putHeadsSyncHanlder;
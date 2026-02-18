const typedesignService = require("../services/typedesignService");

function getTypeDesignDetailsSyncHanlder(fastify) {
    const getTypeDesignDetails = typedesignService.getTypeDesignSyncDetailsService(fastify);

    return async (request, replay) => {
        const { params, logTarce } = request;
        const response = await getTypeDesignDetails({
            params,
            logTarce
        });
        return replay.code(200).send(response);
    }
}

module.exports = getTypeDesignDetailsSyncHanlder;
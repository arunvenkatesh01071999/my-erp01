const fnvShrinkageService = require("../services/fnvShrinkageService");

function getShrinkageInfoHandler(fastify) {
    const getShrinkageInfo = fnvShrinkageService.getShrinkageInfoService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getShrinkageInfo({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getShrinkageInfoHandler;

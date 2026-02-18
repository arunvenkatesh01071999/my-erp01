const fmcgShrinkageService = require("../services/fmcgShrinkageService");

function getShrinkageInfoHandler(fastify) {
    const getShrinkageInfo = fmcgShrinkageService.getShrinkageInfoService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getShrinkageInfo({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getShrinkageInfoHandler;

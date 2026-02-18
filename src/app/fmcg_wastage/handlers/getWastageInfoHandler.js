const fmcgWastageService = require("../services/fmcgWastageService");

function getWastageInfoHandler(fastify) {
    const getWastageInfo = fmcgWastageService.getWastageInfoService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getWastageInfo({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getWastageInfoHandler;

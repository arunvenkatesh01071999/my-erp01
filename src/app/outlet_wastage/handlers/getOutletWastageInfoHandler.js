const outletWastageService = require("../services/outletWastageService");

function getOutletWastageInfoHandler(fastify) {
    const getOutletWastageInfo = outletWastageService.getOutletWastageInfoService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getOutletWastageInfo({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getOutletWastageInfoHandler;

const fmcgPlanningInwardService = require("../services/fmcgPlanningInwardService");

function getFmcgPlanningInwardInfoHandler(fastify) {
    const getFmcgPlanningInwardInfo = fmcgPlanningInwardService.getFmcgPlanningInwardInfoService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getFmcgPlanningInwardInfo({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getFmcgPlanningInwardInfoHandler;

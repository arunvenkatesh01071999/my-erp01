const fmcgPlanningInwardService = require("../services/fmcgPlanningInwardService");

function getFmcgPlanningInwardHandler(fastify) {
    const getFmcgPlanningInward = fmcgPlanningInwardService.getFmcgPlanningInwardService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getFmcgPlanningInward({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getFmcgPlanningInwardHandler;

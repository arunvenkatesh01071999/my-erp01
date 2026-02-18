const fmcgPlanningInwardService = require("../services/fmcgPlanningInwardService");

function getFmcgPlanningInwardDocnoHandler(fastify) {
    const getFmcgPlanningInwardDocno = fmcgPlanningInwardService.getFmcgPlanningInwardDocnoService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await getFmcgPlanningInwardDocno({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getFmcgPlanningInwardDocnoHandler;

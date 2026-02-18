const fmcgPlanningInwardService = require("../services/fmcgPlanningInwardService");

function postFmcgPlanningInwardHandler(fastify) {
    const postFmcgPlanningInward = fmcgPlanningInwardService.postFmcgPlanningInwardService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postFmcgPlanningInward({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postFmcgPlanningInwardHandler;

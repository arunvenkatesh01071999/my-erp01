const fmcgPlanningInwardService = require("../services/fmcgPlanningInwardService");

function putFmcgPlanningInwardHandler(fastify) {
    const putpostFmcgPlanningInward = fmcgPlanningInwardService.putFmcgPlanningInwardService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await putpostFmcgPlanningInward({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = putFmcgPlanningInwardHandler;

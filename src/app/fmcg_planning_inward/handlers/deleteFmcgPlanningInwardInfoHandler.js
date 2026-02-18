const fmcgPlanningInwardService = require("../services/fmcgPlanningInwardService");

function deleteFmcgPlanningInwardInfoHandler(fastify) {
    const deleteFmcgPlanningInwardInfo = fmcgPlanningInwardService.deleteFmcgPlanningInwardInfoService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await deleteFmcgPlanningInwardInfo({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = deleteFmcgPlanningInwardInfoHandler;

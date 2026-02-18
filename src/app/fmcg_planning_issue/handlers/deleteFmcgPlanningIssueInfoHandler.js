const fmcgPlanningIssueService = require("../services/fmcgPlanningIssueService");

function deleteFmcgPlanningIssueInfoHandler(fastify) {
    const deleteFmcgPlanningIssueInfo = fmcgPlanningIssueService.deleteFmcgPlanningIssueInfoService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await deleteFmcgPlanningIssueInfo({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = deleteFmcgPlanningIssueInfoHandler;

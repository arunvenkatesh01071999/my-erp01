const fmcgPlanningIssueService = require("../services/fmcgPlanningIssueService");

function getFmcgPlanningIssueInfoHandler(fastify) {
    const getFmcgPlanningIssueInfo = fmcgPlanningIssueService.getFmcgPlanningIssueInfoService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getFmcgPlanningIssueInfo({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getFmcgPlanningIssueInfoHandler;

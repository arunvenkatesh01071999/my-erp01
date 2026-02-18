const fmcgPlanningIssueService = require("../services/fmcgPlanningIssueService");

function getFmcgPlanningIssueHandler(fastify) {
    const getFmcgPlanningIssue = fmcgPlanningIssueService.getFmcgPlanningIssueService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getFmcgPlanningIssue({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getFmcgPlanningIssueHandler;

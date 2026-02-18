const fmcgPlanningIssueService = require("../services/fmcgPlanningIssueService");

function postFmcgPlanningIssueHandler(fastify) {
    const postFmcgPlanningIssue = fmcgPlanningIssueService.postFmcgPlanningIssueService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postFmcgPlanningIssue({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postFmcgPlanningIssueHandler;

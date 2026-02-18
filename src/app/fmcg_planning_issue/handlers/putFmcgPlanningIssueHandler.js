const fmcgPlanningIssueService = require("../services/fmcgPlanningIssueService");

function putFmcgPlanningIssueHandler(fastify) {
    const putpostFmcgPlanningIssue = fmcgPlanningIssueService.putFmcgPlanningIssueService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await putpostFmcgPlanningIssue({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = putFmcgPlanningIssueHandler;

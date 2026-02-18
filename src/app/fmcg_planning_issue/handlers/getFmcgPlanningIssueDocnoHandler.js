const fmcgPlanningIssueService = require("../services/fmcgPlanningIssueService");

function getFmcgPlanningIssueDocnoHandler(fastify) {
    const getFmcgPlanningIssueDocno = fmcgPlanningIssueService.getFmcgPlanningIssueDocnoService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await getFmcgPlanningIssueDocno({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getFmcgPlanningIssueDocnoHandler;

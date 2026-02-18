const getSalesService = require("../services/getSalesServices");

function allOutletsIssueHandler(fastify) {
    const getallOutletsIssue = getSalesService.getallOutletsIssueService(fastify);
    return async (request, reply) => {
        const { body, params, query, logTrace, userDetails } = request;
        const response = await getallOutletsIssue({
            body,
            params,
            query,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = allOutletsIssueHandler;

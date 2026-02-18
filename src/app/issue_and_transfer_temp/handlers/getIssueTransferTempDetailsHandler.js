const issueTransferServices = require("../services/issueTransferServices");

function postIssueTransferTempDetailsHandler(fastify) {
    const postIssueTransferTempDetails = issueTransferServices.getIssueTransferTempDetailsService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postIssueTransferTempDetails({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postIssueTransferTempDetailsHandler;
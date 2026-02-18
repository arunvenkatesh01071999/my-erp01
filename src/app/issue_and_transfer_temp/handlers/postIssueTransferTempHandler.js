const issueTransferServices = require("../services/issueTransferServices");

function postIssueTransferTempHandler(fastify) {
    const postIssueTransferTemp = issueTransferServices.postIssueTransferTempService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postIssueTransferTemp({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postIssueTransferTempHandler;

const issueTransferServices = require("../services/issueTransferServices");


function deleteIssueTransferTempHandler(fastify) {
    const deleteIssueTransferTemp = issueTransferServices.deleteIssueTransferTempService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await deleteIssueTransferTemp({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = deleteIssueTransferTempHandler;

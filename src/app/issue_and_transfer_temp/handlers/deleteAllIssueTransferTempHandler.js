const issueTransferServices = require("../services/issueTransferServices");


function deleteAllIssueTransferTempHandler(fastify) {
    const deleteAllIssueTransferTemp = issueTransferServices.deleteAllIssueTransferTempService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await deleteAllIssueTransferTemp({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = deleteAllIssueTransferTempHandler;

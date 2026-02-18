const SalesReturnService = require("../services/SalesReturnApprovalService");

function UpdateSalesReturnApprovalHandler(fastify) {
    const UpdateSalesReturnApproval = SalesReturnService.UpdateSalesReturnApprovalService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await UpdateSalesReturnApproval({
            params,
            body,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = UpdateSalesReturnApprovalHandler;

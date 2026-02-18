const SalesReturnService = require("../services/SalesReturnApprovalService");

function ReverseSalesReturnApprovalHandler(fastify) {
    const ReverseSalesReturnApproval = SalesReturnService.ReverseSalesReturnApprovalService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await ReverseSalesReturnApproval({
            params,
            body,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = ReverseSalesReturnApprovalHandler;

const SalesReturnService = require("../services/SalesReturnApprovalService");

function getAllSalesReturnApprovalHandler(fastify) {
    const GetAllsalesReturnApproval = SalesReturnService.GetAllsalesReturnApproval(fastify);

    return async function (request, reply) {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await GetAllsalesReturnApproval({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getAllSalesReturnApprovalHandler;

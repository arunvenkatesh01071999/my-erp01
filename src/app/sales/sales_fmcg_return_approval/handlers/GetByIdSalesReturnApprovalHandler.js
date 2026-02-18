const SalesReturnService = require("../services/SalesReturnApprovalService");

function getByIdSalesReturnApprovalHandler(fastify) {
    const getByIdSalesReturn = SalesReturnService.GetByIdsalesReturnApproval(fastify);

    return async function (request, reply) {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getByIdSalesReturn({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getByIdSalesReturnApprovalHandler;

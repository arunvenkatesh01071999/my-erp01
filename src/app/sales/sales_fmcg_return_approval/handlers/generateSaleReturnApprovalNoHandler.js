const SalesReturnService = require("../services/SalesReturnApprovalService");

function generateSaleReturnApprovalNoHandler(fastify) {
    const generateSaleReturnNo = SalesReturnService.generateSaleReturnApprovalNoService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, query } = request;
        const response = await generateSaleReturnNo({ body, params, logTrace, query });
        return reply.code(200).send(response);
    };
}

module.exports = generateSaleReturnApprovalNoHandler;

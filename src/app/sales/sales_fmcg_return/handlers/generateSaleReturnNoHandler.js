const SalesReturnService = require("../services/SalesReturnService");

function generateSaleReturnNoHandler(fastify) {
    const generateSaleReturnNo = SalesReturnService.generateSaleReturnNoService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, query } = request;
        const response = await generateSaleReturnNo({ body, params, logTrace, query });
        return reply.code(200).send(response);
    };
}

module.exports = generateSaleReturnNoHandler;

const StockCorrectionService = require("../services/StockCorrectionService");

function getProductBalanceHandler(fastify) {
    const getProductBalance = StockCorrectionService.getProductBalanceService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getProductBalance({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getProductBalanceHandler;

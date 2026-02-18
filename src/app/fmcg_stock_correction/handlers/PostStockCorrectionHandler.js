const StockCorrectionService = require("../services/StockCorrectionService");

function postStockCorrectionHandler(fastify) {
    const postStockCorrection = StockCorrectionService.postStockCorrectionService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await postStockCorrection({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = postStockCorrectionHandler;

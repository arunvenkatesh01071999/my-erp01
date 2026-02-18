const outletClosingStocksService = require("../services/outletClosingStocksTempServices");

function postOutletClosingStocksTempHandler(fastify) {
    const postOutletClosingStocksTemp = outletClosingStocksService.postOutletClosingStocksTempService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postOutletClosingStocksTemp({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postOutletClosingStocksTempHandler;

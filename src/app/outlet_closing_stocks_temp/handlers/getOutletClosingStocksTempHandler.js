const outletClosingStocksService = require("../services/outletClosingStocksTempServices");

function getOutletClosingStocksTempHandler(fastify) {
    const getOutletClosingStocksTemp = outletClosingStocksService.getOutletClosingStocksTempService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await getOutletClosingStocksTemp({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getOutletClosingStocksTempHandler;

const outletClosingStocksService = require("../services/outletClosingStocksTempServices");

function deleteOutletClosingStocksTempHandler(fastify) {
    const deleteOutletClosingStocksTemp = outletClosingStocksService.deleteOutletClosingStocksTempService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await deleteOutletClosingStocksTemp({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = deleteOutletClosingStocksTempHandler;

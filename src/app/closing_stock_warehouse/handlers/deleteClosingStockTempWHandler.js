const closingStockServices = require("../services/ClosingStockServices");


function deleteClosingStockTempHandler(fastify) {
    const deleteClosingStockTemp = closingStockServices.deleteClosingStockTempWService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await deleteClosingStockTemp({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = deleteClosingStockTempHandler;

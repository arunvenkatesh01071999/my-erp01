const closingStockServices = require("../services/ClosingStockServices");


function deleteAllClosingStockTempHandler(fastify) {
    const deleteAllClosingStockTemp = closingStockServices.deleteAllClosingStockTempService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await deleteAllClosingStockTemp({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = deleteAllClosingStockTempHandler;

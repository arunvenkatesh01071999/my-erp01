const closingStockServices = require("../services/ClosingStockServices");


function deleteAllMissingStockHandler(fastify) {
    const deleteAllMissingStock = closingStockServices.deleteAllMissingStockService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await deleteAllMissingStock({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = deleteAllMissingStockHandler;

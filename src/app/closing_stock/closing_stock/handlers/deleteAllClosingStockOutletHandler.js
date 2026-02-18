const closingStockServices = require("../services/ClosingStockServices");


function deleteAllClosingStockOutletHandler(fastify) {
    const deleteAllClosingStockOutlet = closingStockServices.deleteAllClosingStockOutletService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await deleteAllClosingStockOutlet({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = deleteAllClosingStockOutletHandler;

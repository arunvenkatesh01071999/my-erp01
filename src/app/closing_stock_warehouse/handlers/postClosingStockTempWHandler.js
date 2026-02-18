const ClosingStockServices = require("../services/ClosingStockServices");

function postClosingStockTempHandler(fastify) {
    const postClosingStockTempW = ClosingStockServices.postClosingStockTempWService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postClosingStockTempW({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postClosingStockTempHandler;

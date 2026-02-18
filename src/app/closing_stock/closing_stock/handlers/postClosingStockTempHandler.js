const ClosingStockServices = require("../services/ClosingStockServices");

function postClosingStockTempHandler(fastify) {
    const postClosingStockTemp = ClosingStockServices.postClosingStockTempService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postClosingStockTemp({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postClosingStockTempHandler;

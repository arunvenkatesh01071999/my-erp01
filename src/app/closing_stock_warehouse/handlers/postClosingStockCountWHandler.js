const ClosingStockServices = require("../services/ClosingStockServices");

function postClosingStockCountHandler(fastify) {
    const postClosingStockCount = ClosingStockServices.postClosingStockCountWService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postClosingStockCount({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postClosingStockCountHandler;
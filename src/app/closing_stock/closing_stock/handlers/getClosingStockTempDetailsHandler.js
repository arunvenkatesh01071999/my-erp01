const ClosingStockServices = require("../services/ClosingStockServices");

function postClosingStockTempDetailsHandler(fastify) {
    const postClosingStockTempDetails = ClosingStockServices.getClosingStockTempDetailsService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postClosingStockTempDetails({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postClosingStockTempDetailsHandler;
const ClosingStockServices = require("../services/ClosingStockServices");


function postAvailableStockCountHandler(fastify) {
    const postAvailableStockCount = ClosingStockServices.postAvailableStockCountService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postAvailableStockCount({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postAvailableStockCountHandler;
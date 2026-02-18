const purchaseService = require("../services/purchaseServices");

function getPurchaseGrnListHandler(fastify) {
    const getPurchaseGrnList = purchaseService.getPurchaseGrnListService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getPurchaseGrnList({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getPurchaseGrnListHandler;

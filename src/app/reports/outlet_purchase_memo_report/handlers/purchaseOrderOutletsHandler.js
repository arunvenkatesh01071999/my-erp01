const purchaseServices = require("../services/purchaseServices");

function purchaseOrderOutletsHandler(fastify) {
    const purchaseOrderOutlets = purchaseServices.purchaseOrderOutletsService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await purchaseOrderOutlets({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = purchaseOrderOutletsHandler;

const purchaseServices = require("../services/purchaseServices");

function purchaseOrderRegionsHandler(fastify) {
    const purchaseOrderRegions = purchaseServices.purchaseOrderRegionsService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await purchaseOrderRegions({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = purchaseOrderRegionsHandler;

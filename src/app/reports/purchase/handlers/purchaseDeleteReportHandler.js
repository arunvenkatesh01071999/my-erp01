const purchaseServices = require("../services/purchaseServices");

function purchaseDeleteReportHandler(fastify) {
    const purchaseDeleteReport = purchaseServices.deletePurchaseReportService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await purchaseDeleteReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = purchaseDeleteReportHandler;

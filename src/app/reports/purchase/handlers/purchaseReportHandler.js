const purchaseServices = require("../services/purchaseServices");

function purchaseReportHandler(fastify) {
    const getPurchaseReport = purchaseServices.getPurchaseReportService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getPurchaseReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = purchaseReportHandler;

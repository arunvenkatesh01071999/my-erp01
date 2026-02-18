const purchaseServices = require("../services/purchaseServices");

function purchaseReturnReportHandler(fastify) {
    const getPurchaseReturnReport = purchaseServices.getPurchaseReturnReportService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getPurchaseReturnReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = purchaseReturnReportHandler;

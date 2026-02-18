const salesServices = require("../services/outletSalesServices");

function outletSalesItemWiseAllReportHandler(fastify) {
    const outletSalesItemWiseAllReport = salesServices.outletSalesItemWiseAllReportService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await outletSalesItemWiseAllReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = outletSalesItemWiseAllReportHandler;

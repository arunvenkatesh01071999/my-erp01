const salesServices = require("../services/salesServices");

function salesItemWiseBreakupReportHandler(fastify) {
    const getSalesItemwiseBreakupReport = salesServices.getSalesItemwiseBreakupReportService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getSalesItemwiseBreakupReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = salesItemWiseBreakupReportHandler;

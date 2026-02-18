const outletSalesServices = require("../services/outletSalesServices");

function salesItemWiseBreakupReportHandler(fastify) {
    const getSalesItemwiseBreakupReport = outletSalesServices.getOutletSalesItemwiseBreakupReportService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getSalesItemwiseBreakupReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = salesItemWiseBreakupReportHandler;

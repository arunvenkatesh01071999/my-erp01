const outletSalesServices = require("../services/outletSalesServices");

function salesItemWiseReportHandler(fastify) {
    const getSalesItemwiseReport = outletSalesServices.getOutletSalesItemwiseReportService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getSalesItemwiseReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = salesItemWiseReportHandler;

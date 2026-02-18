const salesServices = require("../services/salesServices");

function salesItemWiseReportHandler(fastify) {
    const getSalesItemwiseReport = salesServices.getSalesItemwiseReportService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getSalesItemwiseReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = salesItemWiseReportHandler;

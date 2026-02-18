const salesServices = require("../services/salesServices");

function salesItemWiseAllReportHandler(fastify) {
    const getSalesItemwiseAllReport = salesServices.getSalesItemwiseAllReportService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getSalesItemwiseAllReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = salesItemWiseAllReportHandler;

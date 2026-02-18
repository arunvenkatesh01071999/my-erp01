const salesServices = require("../services/salesServices");

function salesGroupWiseAllReportHandler(fastify) {
    const getSalesGroupwiseAllReport = salesServices.getSalesGroupwiseAllReportService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getSalesGroupwiseAllReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = salesGroupWiseAllReportHandler;

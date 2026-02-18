const salesServices = require("../services/outletSalesServices");

function outletSalesGroupWiseAllReportHandler(fastify) {
    const getOutletSalesGroupwiseAllReport = salesServices.getOutletSalesGroupwiseAllReportService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getOutletSalesGroupwiseAllReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = outletSalesGroupWiseAllReportHandler;

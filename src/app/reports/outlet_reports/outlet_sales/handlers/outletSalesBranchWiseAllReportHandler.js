const outletSalesServices = require("../services/outletSalesServices");

function outletSalesBranchWiseAllReportHandler(fastify) {
    const getSalesBranchwiseReport = outletSalesServices.getOutletSalesBranchwiseReportService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getSalesBranchwiseReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = outletSalesBranchWiseAllReportHandler;

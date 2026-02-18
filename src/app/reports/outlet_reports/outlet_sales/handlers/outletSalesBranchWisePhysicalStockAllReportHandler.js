const outletSalesServices = require("../services/outletSalesServices");

function outletSalesBranchWisePhysicalStockAllReportHandler(fastify) {
    const getSalesBranchwisePhysicalStockReport = outletSalesServices.getOutletSalesBranchwisePhysicalStockReportService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getSalesBranchwisePhysicalStockReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = outletSalesBranchWisePhysicalStockAllReportHandler;

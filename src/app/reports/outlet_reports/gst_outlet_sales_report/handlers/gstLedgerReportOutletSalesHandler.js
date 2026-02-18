const gstLedgerOutletSalesServices = require("../services/gstLedgerOutletSalesServices");

function gstLedgerReportHandler(fastify) {
    const purchaseGstLedgerOutletSalesReport = gstLedgerOutletSalesServices.gstLedgerReportOutletSalesService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await purchaseGstLedgerOutletSalesReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = gstLedgerReportHandler;

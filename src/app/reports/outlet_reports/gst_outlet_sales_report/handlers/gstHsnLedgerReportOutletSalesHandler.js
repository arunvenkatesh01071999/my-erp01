const gstLedgerOutletSalesServices = require("../services/gstLedgerOutletSalesServices");

function gstHsnLedgerReportOutletSalesHandler(fastify) {
    const hsnPurchaseGstLedgerOutletSalesReport = gstLedgerOutletSalesServices.hsnGstLedgerReportOutletSalesService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await hsnPurchaseGstLedgerOutletSalesReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = gstHsnLedgerReportOutletSalesHandler;

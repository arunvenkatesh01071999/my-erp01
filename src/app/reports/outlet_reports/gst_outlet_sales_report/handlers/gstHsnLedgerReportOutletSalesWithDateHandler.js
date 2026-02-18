const gstLedgerOutletSalesServices = require("../services/gstLedgerOutletSalesServices");

function gstHsnLedgerReportOutletSalesWithDateHandler(fastify) {
    const hsnPurchaseGstLedgerOutletSalesWithDateReport = gstLedgerOutletSalesServices.hsnGstLedgerReportOutletSalesWithDateService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await hsnPurchaseGstLedgerOutletSalesWithDateReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = gstHsnLedgerReportOutletSalesWithDateHandler;

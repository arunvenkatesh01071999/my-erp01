const gstLedgerServices = require("../services/gstLedgerServices");

function gstHsnLedgerReportHandler(fastify) {
    const hsnPurchaseGstLedgerReport = gstLedgerServices.hsnGstLedgerReportService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await hsnPurchaseGstLedgerReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = gstHsnLedgerReportHandler;

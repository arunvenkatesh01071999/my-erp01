const gstLedgerServices = require("../services/gstLedgerServices");

function gstLedgerReportHandler(fastify) {
    const purchaseGstLedgerReport = gstLedgerServices.gstLedgerReportService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await purchaseGstLedgerReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = gstLedgerReportHandler;

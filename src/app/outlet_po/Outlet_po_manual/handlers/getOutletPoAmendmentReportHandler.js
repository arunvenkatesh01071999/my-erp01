const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function getOutletPoAmendmentReportHandler(fastify) {
    const getOutletPoAmendmentReportService = outletPurchaseOrderServices.getOutletPoAmendmentReportService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getOutletPoAmendmentReportService({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getOutletPoAmendmentReportHandler;

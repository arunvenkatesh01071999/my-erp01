const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function getApprovalReportOutletPoHandler(fastify) {
    const getApprovalReportOutlet = outletPurchaseOrderServices.getOutletPoApprovalReportService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getApprovalReportOutlet({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getApprovalReportOutletPoHandler;

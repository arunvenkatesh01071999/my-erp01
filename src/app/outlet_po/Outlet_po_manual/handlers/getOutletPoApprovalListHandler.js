const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function getOutletPoApprovalListHandler(fastify) {
    const getOutletPoApprovalList = outletPurchaseOrderServices.getOutletPoApprovalListService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getOutletPoApprovalList({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getOutletPoApprovalListHandler;

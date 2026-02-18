const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function getOutletPoOverviewHandler(fastify) {
    const getOutletPoOverview = outletPurchaseOrderServices.getOutletPoOverviewService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getOutletPoOverview({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getOutletPoOverviewHandler;

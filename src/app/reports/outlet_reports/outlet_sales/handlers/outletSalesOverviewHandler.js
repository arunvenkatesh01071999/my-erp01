const salesServices = require("../services/outletSalesServices");

function outletSalesOverviewHandler(fastify) {
    const outletSalesOverview = salesServices.outletSalesOverviewService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await outletSalesOverview({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = outletSalesOverviewHandler;

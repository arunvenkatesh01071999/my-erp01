const salesServices = require("../services/outletSalesServices");

function warehouseSalesOverviewHandler(fastify) {
    const warehouseSalesOverview = salesServices.warehouseSalesOverviewService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await warehouseSalesOverview({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = warehouseSalesOverviewHandler;

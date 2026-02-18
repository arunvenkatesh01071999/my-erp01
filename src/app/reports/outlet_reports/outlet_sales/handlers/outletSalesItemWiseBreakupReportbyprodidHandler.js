const outletSalesServices = require("../services/outletSalesServices");

function outletSalesItemWiseBreakupReportbyprodidHandler(fastify) {
    const outletSalesItemWiseBreakupReport = outletSalesServices.outletSalesItemWiseBreakupReportbyprodidService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await outletSalesItemWiseBreakupReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = outletSalesItemWiseBreakupReportbyprodidHandler;

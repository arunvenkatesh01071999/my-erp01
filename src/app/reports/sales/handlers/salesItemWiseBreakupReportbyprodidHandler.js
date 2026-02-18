const salesServices = require("../services/salesServices");

function salesItemWiseBreakupReportProdidHandler(fastify) {
    const getSalesItemwiseBreakupReportProdid = salesServices.getSalesItemwiseBreakupReportProdidService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getSalesItemwiseBreakupReportProdid({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = salesItemWiseBreakupReportProdidHandler;

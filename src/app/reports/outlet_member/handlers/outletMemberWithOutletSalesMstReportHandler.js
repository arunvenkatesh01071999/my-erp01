const outletMemberServices = require("../services/outletMemberServices.js");

function outletMemberWithOutletSalesMstReportHandler(fastify) {
    const getOutletMemberWithOutletSalesMstReport = outletMemberServices.getOutletMemberWithOutletSalesMstReportService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getOutletMemberWithOutletSalesMstReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = outletMemberWithOutletSalesMstReportHandler;

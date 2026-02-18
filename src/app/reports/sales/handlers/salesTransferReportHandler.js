const salesServices = require("../services/salesServices");

function salesTransferReportHandler(fastify) {
    const getSalesTransfer = salesServices.getSalesTransferService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getSalesTransfer({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = salesTransferReportHandler;

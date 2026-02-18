const stockMissingServices = require("../services/stockMissingServices");

function stockMissingReportHandler(fastify) {
    const getstockMissingReport = stockMissingServices.getstockMissingReportService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getstockMissingReport({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = stockMissingReportHandler;

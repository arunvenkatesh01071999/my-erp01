const stockMissingServices = require("../services/stockMissingServices");

function stockMissingReportNewHandler(fastify) {
    const getstockMissingReportNew = stockMissingServices.getstockMissingReportNewService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getstockMissingReportNew({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = stockMissingReportNewHandler;

const syncfetchService = require("../services/syncfetchService");


function getSyncOutletPoDetailsHandler(fastify) {
    const getSyncOutletPoDetails = syncfetchService.getSyncOutletPoDetailsService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await getSyncOutletPoDetails({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getSyncOutletPoDetailsHandler;

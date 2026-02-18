const fmcgBatchUpdateService = require("../services/fmcgBatchUpdateService");

function fmcgBatchUpdateHandler(fastify) {
    const fmcgBatchUpdate = fmcgBatchUpdateService.postBatchUpdateService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await fmcgBatchUpdate({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = fmcgBatchUpdateHandler;

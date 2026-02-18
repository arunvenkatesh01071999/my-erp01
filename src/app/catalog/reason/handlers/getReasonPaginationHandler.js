const postReasonService = require("../services/postReasonService");

function getReasonPaginationHandler(fastify) {
    const getReasonPaginate = postReasonService.getReasonPaginateService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, query } = request;
        const response = await getReasonPaginate({ params, body, logTrace, query });
        return reply.code(200).send(response);
    };
}

module.exports = getReasonPaginationHandler;

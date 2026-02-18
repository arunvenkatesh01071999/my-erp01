const fmcgWastageService = require("../services/fmcgWastageService");

function postWastageListHandler(fastify) {
    const postWastageList = fmcgWastageService.postWastageListService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await postWastageList({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = postWastageListHandler;

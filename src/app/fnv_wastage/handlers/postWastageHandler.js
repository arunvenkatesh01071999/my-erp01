const fmcgWastageService = require("../services/fmcgWastageService");

function postWastageHandler(fastify) {
    const postWastage = fmcgWastageService.postWastageService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postWastage({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postWastageHandler;

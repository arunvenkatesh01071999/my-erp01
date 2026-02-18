const fmcgShrinkageService = require("../services/fmcgShrinkageService");

function postShrinkageHandler(fastify) {
    const postShrinkage = fmcgShrinkageService.postShrinkageService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postShrinkage({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postShrinkageHandler;

const fmcgShrinkageService = require("../services/fmcgShrinkageService");

function putShrinkageHandler(fastify) {
    const putShrinkage = fmcgShrinkageService.putShrinkageService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await putShrinkage({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = putShrinkageHandler;

const fnvShrinkageService = require("../services/fnvShrinkageService");

function postShrinkageHandler(fastify) {
    const postShrinkage = fnvShrinkageService.postShrinkageService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postShrinkage({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postShrinkageHandler;

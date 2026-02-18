const fnvShrinkageService = require("../services/fnvShrinkageService");

function getShrinkageHandler(fastify) {
    const getShrinkage = fnvShrinkageService.getShrinkageService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getShrinkage({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getShrinkageHandler;

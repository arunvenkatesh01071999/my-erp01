const fnvShrinkageService = require("../services/fnvShrinkageService");

function getShrinkageDocnoHandler(fastify) {
    const getShrinkageDocno = fnvShrinkageService.getShrinkageDocnoService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await getShrinkageDocno({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getShrinkageDocnoHandler;

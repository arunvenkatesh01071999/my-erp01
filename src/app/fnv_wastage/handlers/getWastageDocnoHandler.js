const fmcgWastageService = require("../services/fmcgWastageService");

function getWastageDocnoHandler(fastify) {
    const getWastageDocno = fmcgWastageService.getWastageDocnoService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await getWastageDocno({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getWastageDocnoHandler;

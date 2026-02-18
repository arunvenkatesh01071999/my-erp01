const fmcgWastageService = require("../services/fmcgWastageService");

function getWastageHandler(fastify) {
    const getWastage = fmcgWastageService.getWastageService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getWastage({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getWastageHandler;

const fmcgWastageService = require("../services/fmcgWastageService");

function putWastageHandler(fastify) {
    const putWastage = fmcgWastageService.putWastageService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await putWastage({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = putWastageHandler;

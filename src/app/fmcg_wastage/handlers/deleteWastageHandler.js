const fmcgWastageService = require("../services/fmcgWastageService");

function deleteWastageHandler(fastify) {
    const deleteWastage = fmcgWastageService.deleteWastageService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await deleteWastage({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = deleteWastageHandler;

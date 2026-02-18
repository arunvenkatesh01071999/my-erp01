const fmcgShrinkageService = require("../services/fmcgShrinkageService");

function deleteShrinkageHandler(fastify) {
    const deleteShrinkage = fmcgShrinkageService.deleteShrinkageService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await deleteShrinkage({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = deleteShrinkageHandler;

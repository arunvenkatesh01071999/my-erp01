const receipeService = require("../services/receipeService");

function putReceipeHandler(fastify) {
    const putReceipe = receipeService.putReceipeService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await putReceipe({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = putReceipeHandler;

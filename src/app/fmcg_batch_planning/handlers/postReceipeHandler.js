const receipeService = require("../services/receipeService");

function postReceipeHandler(fastify) {
    const postReceipe = receipeService.postReceipeService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postReceipe({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postReceipeHandler;

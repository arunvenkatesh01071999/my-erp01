const receipeService = require("../services/receipeService");

function getReceipeHandler(fastify) {
    const getReceipe = receipeService.getReceipeService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getReceipe({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getReceipeHandler;

const receipeService = require("../services/receipeService");

function deleteReceipeHandler(fastify) {
    const deleteReceipe = receipeService.deleteReceipeService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await deleteReceipe({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = deleteReceipeHandler;

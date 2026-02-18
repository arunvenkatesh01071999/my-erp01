const receipeService = require("../services/receipeService");

function getReceipeInfoHandler(fastify) {
    const getReceipeInfo = receipeService.getReceipeInfoService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getReceipeInfo({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getReceipeInfoHandler;

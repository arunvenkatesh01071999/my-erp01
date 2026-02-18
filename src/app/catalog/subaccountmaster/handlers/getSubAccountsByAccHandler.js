const postSubAccountsService = require("../services/postSubAccountsService");

function getSubAccountsByAccHandler(fastify) {
    const getSubAccountsByAcc = postSubAccountsService.getSubAccountsByAccService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace } = request;
        const response = await getSubAccountsByAcc({ params, body, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getSubAccountsByAccHandler;

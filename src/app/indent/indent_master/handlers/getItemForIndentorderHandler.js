const indentOrderServices = require("../services/indentOrderServices");

function getItemForIndentorderHandler(fastify) {
    const getItemIndentOrderDetailsService = indentOrderServices.getItemIndentOrderDetailsService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await getItemIndentOrderDetailsService({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getItemForIndentorderHandler;

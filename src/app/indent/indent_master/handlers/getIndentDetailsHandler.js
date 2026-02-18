const indentOrderServices = require("../services/indentOrderServices");

function getIndentDetailsHandler(fastify) {
    const getIndentDetails = indentOrderServices.getIndentDetailsService(fastify);

    return async (request, reply) => {
        const { params, body, query, logTrace, userDetails } = request;
        const response = await getIndentDetails({ params, body, logTrace, query, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getIndentDetailsHandler;
const indentOrderServices = require("../services/indentOrderServices.js");

function getIndentOrderProductDetailsHandler(fastify) {
    const getIndentOrderProductDetails = indentOrderServices.getIndentOrderProductDetailsService(fastify);

    return async (request, reply) => {
        const { params, body, query, logTrace, userDetails } = request;
        const response = await getIndentOrderProductDetails({ params, body, logTrace, query, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getIndentOrderProductDetailsHandler;

const indentOrderServices = require("../services/indentOrderServices.js");

function getIndentOrderProductDetailsAllHandler(fastify) {
    const getIndentOrderProductDetailsAll = indentOrderServices.getIndentOrderProductDetailsAllService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await getIndentOrderProductDetailsAll({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getIndentOrderProductDetailsAllHandler;

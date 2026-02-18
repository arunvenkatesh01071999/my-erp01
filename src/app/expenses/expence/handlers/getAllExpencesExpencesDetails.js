const expencesService = require("../services/expenceServices");

function getExpenseExpencesDetails(fastify) {
    const getAllExpencesExpencesDetails = expencesService.getAllExpencesExpencesDetailsService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getAllExpencesExpencesDetails({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getExpenseExpencesDetails;

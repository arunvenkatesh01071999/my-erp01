const expenceServices = require("../services/expenceServices");

function deleteExpencesWithExpencesDetails(fastify) {
    const deleteExpencesWithExpences = expenceServices.deleteExpenceWithExpencesDetailsService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await deleteExpencesWithExpences({
            params,
            body,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = deleteExpencesWithExpencesDetails;

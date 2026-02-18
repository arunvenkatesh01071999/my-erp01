const expenceServices = require("../services/expenceServices");

function deleteOutletExpencesWithOutletExpencesDetails(fastify) {
    const deleteExpenceWithOutletExpencesDetails = expenceServices.deleteExpenceWithOutletExpencesDetailsService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await deleteExpenceWithOutletExpencesDetails({
            params,
            body,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = deleteOutletExpencesWithOutletExpencesDetails;

const expenceServices = require("../services/expenceServices");

function getAllOutletExpencesWithOutletExpencesDetails(fastify) {
    const getOutletExpenceAllWithOutletExpencesDetails = expenceServices.getAllOutletExpenceWithOutletExpencesDetailsService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await getOutletExpenceAllWithOutletExpencesDetails({
            params,
            body,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = getAllOutletExpencesWithOutletExpencesDetails;

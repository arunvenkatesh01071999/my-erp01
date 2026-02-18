const expenceServices = require("../services/expenceServices");

function postOutletExpencesWithOutletExpencesDetails(fastify) {
    const postExpenceWithOutletExpencesDetails = expenceServices.postExpenceWithOutletExpencesDetailsService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postExpenceWithOutletExpencesDetails({
            params,
            body,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = postOutletExpencesWithOutletExpencesDetails;

const expenceServices = require("../services/expenceServices");

function postExpencesWithExpencesDetails(fastify) {
    const postExpenceWithExpencesDetails = expenceServices.postExpenceWithExpencesDetailsService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postExpenceWithExpencesDetails({
            params,
            body,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = postExpencesWithExpencesDetails;

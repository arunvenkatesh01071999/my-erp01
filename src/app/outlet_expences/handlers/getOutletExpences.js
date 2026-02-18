const expenceServices = require("../services/expenceServices");

function getOutletExpences(fastify) {
    const getExpenceDocno = expenceServices.getOutletExpenceService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await getExpenceDocno({
            params,
            body,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = getOutletExpences;

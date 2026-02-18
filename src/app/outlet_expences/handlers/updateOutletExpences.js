const expenceServices = require("../services/expenceServices");


function updateOutletExpences(fastify) {
    const updateOutletExpence = expenceServices.updateOutletExpenceService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await updateOutletExpence({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = updateOutletExpences;

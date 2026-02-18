const expenceServices = require("../services/expenceServices");

function getAllOutletExpences(fastify) {
    const getOutletExpenceAll = expenceServices.getAllOutletExpenceService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await getOutletExpenceAll({
            params,
            body,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = getAllOutletExpences;

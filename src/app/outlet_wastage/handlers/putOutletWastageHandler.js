const outletWastageService = require("../services/outletWastageService");

function putOutletWastageHandler(fastify) {
    const putOutletWastage = outletWastageService.putOutletWastageService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await putOutletWastage({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = putOutletWastageHandler;

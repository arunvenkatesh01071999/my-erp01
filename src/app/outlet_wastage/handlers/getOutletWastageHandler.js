const outletWastageService = require("../services/outletWastageService");

function getOutletWastageHandler(fastify) {
    const getOutletWastage = outletWastageService.getOutletWastageService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getOutletWastage({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getOutletWastageHandler;

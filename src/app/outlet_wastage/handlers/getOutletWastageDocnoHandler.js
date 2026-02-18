const outletWastageService = require("../services/outletWastageService");

function getOutletWastageDocnoHandler(fastify) {
    const getOutletWastageDocno = outletWastageService.getOutletWastageDocnoService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await getOutletWastageDocno({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getOutletWastageDocnoHandler;

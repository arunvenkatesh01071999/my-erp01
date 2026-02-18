const outletWastageService = require("../services/outletWastageService");

function deleteOutletWastageHandler(fastify) {
    const deleteOutletWastage = outletWastageService.deleteOutletWastageService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await deleteOutletWastage({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = deleteOutletWastageHandler;

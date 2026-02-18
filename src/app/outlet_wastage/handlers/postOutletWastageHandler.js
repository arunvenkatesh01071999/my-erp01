const outletWastageService = require("../services/outletWastageService");

function postOutletWastageHandler(fastify) {
    const postOutletWastage = outletWastageService.postOutletWastageService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postOutletWastage({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postOutletWastageHandler;

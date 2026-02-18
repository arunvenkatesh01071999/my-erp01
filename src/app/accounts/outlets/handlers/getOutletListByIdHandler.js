const outletServices = require("../services/outletServices");

function getOutletListByIdHandler(fastify) {
    const getOutletListById = outletServices.getOutletistByIdService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, query, userDetails } = request;
        const response = await getOutletListById({ body, params, logTrace, query, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getOutletListByIdHandler;

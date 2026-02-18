const wastageServices = require("../services/wastageMasterServices");

function getPaymentDocnoHandler(fastify) {
    const getPaymentDocno = wastageServices.getWastageDocnoService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getPaymentDocno({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getPaymentDocnoHandler;

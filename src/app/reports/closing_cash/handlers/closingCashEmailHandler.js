const closingCashServices = require("../services/closingCashServices");

function closingCashEmailHandler(fastify) {
    const closingCashEmail = closingCashServices.closingCashEmailService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await closingCashEmail({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = closingCashEmailHandler;

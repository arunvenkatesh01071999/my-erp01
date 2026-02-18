const paymentServices = require("../services/paymentServices");

function getPurchaseBYId(fastify) {
    const getaccountMaster = paymentServices.getByPartyIdService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getaccountMaster({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getPurchaseBYId;

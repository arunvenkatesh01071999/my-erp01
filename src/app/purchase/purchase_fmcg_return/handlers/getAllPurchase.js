const purchasereturnServices = require("../services/purchaseReturnServices");

function getPurchaseDocNoHandler(fastify) {
    const getaccountMaster = purchasereturnServices.getPurchaseDocNoService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getaccountMaster({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getPurchaseDocNoHandler;
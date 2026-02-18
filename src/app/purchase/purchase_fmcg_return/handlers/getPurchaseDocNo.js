const purchasereturnServices = require("../services/purchaseReturnServices");

function getPurchaseReturn(fastify) {
    const getaccountMaster = purchasereturnServices.getPurchaseReturnByDocNoService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getaccountMaster({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getPurchaseReturn;

const purchasereturnServices = require("../services/purchaseReturnServices");

function generatePurchaseReturnNoHandler(fastify) {
    const generatePurchaseReturnNo = purchasereturnServices.getPurchaseReturnDocNoService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await generatePurchaseReturnNo({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = generatePurchaseReturnNoHandler;
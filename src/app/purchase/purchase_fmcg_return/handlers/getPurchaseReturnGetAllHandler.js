const purchasereturnServices = require("../services/purchaseReturnServices");

function getPurchaseReturnGetAllHandler(fastify) {
    const getPurchaseReturnGetAll = purchasereturnServices.getPurchaseReturnGetAllService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getPurchaseReturnGetAll({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getPurchaseReturnGetAllHandler;
const purchasereturnServices = require("../services/purchaseReturnServices");

function getPurchaseReturnBySupplierHanlder(fastify) {
    const getPurchaseReturnBySupplier = purchasereturnServices.getPurchaseReturnBySupplierService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getPurchaseReturnBySupplier({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getPurchaseReturnBySupplierHanlder;
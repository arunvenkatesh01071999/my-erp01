const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function getPurchaseOrderSupplierListHandler(fastify) {

    const getPurchaseOrderSupplierListServices = outletPurchaseOrderServices.getPurchaseOrderSupplierListServices(fastify);

    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await getPurchaseOrderSupplierListServices({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getPurchaseOrderSupplierListHandler;

const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function getPurchaseOrderBrandCompanyListHandler(fastify) {

    const getPurchaseOrderBrandCompanyListServices = outletPurchaseOrderServices.getPurchaseOrderBrandCompanyListServices(fastify);

    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await getPurchaseOrderBrandCompanyListServices({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getPurchaseOrderBrandCompanyListHandler;

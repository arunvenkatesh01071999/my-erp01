const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function getPurchaseOrdereOutletListHandler(fastify) {

    const getPurchaseOrdereOutletList = outletPurchaseOrderServices.getPurchaseOrdereOutletListServices(fastify);

    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await getPurchaseOrdereOutletList({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getPurchaseOrdereOutletListHandler;

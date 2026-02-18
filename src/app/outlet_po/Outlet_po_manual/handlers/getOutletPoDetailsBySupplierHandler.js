const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function getOutletPoDetailsBySupplierHandler(fastify) {
    const getOutletPoDetailsBySupplier = outletPurchaseOrderServices.getOutletPoDetailsBySupplierService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getOutletPoDetailsBySupplier({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getOutletPoDetailsBySupplierHandler;

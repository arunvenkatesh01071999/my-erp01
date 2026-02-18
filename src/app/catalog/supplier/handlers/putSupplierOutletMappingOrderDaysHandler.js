const supplierServices = require("../services/supplierService");


function putSupplierOutletMappingOrderDaysHandler(fastify) {
    const putSupplierOutletMappingOrderDays = supplierServices.putSuplierOutlertMappingService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, query, userDetails } = request;
        const response = await putSupplierOutletMappingOrderDays({ body, params, logTrace, query, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = putSupplierOutletMappingOrderDaysHandler;

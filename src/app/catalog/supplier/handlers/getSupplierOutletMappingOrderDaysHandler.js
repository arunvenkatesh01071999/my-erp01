const supplierServices = require("../services/supplierService");


function getSupplierOutletMappingOrderDaysHandler(fastify) {
    const getSupplierOutletMappingOrderDays = supplierServices.getSuplierOutlertMappingOrderDaysService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, query } = request;
        const response = await getSupplierOutletMappingOrderDays({ body, params, logTrace, query });
        return reply.code(200).send(response);
    };
}

module.exports = getSupplierOutletMappingOrderDaysHandler;

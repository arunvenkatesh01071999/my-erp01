const supplierServices = require("../services/supplierService");


function putSupplierOutletMappingOrderDaysBrandHandler(fastify) {
    const putSuplierOutlertMappingBrandService = supplierServices.putSuplierOutlertMappingBrandService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, query, userDetails } = request;
        const response = await putSuplierOutlertMappingBrandService({ body, params, logTrace, query, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = putSupplierOutletMappingOrderDaysBrandHandler;

const supplierServices = require("../services/supplierService");


function getSupplierOutletMappingHandler(fastify) {
    const getSupplierOutletMapping = supplierServices.getSuplierOutlertMappingService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, query } = request;
        const response = await getSupplierOutletMapping({ body, params, logTrace, query });
        return reply.code(200).send(response);
    };
}

module.exports = getSupplierOutletMappingHandler;

const supplierServices = require("../services/supplierService");

function excelSupplierOuteletMappingHandler(fastify) {
    const excelSupplierOuteletMappingService = supplierServices.excelSupplierOuteletMappingService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await excelSupplierOuteletMappingService({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = excelSupplierOuteletMappingHandler;

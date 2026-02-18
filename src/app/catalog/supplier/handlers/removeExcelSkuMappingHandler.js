const supplierServices = require("../services/supplierService");

function removeExcelSkuMappingHandler(fastify) {
    const removeExcelSkuMapping = supplierServices.removeExcelSkuMappingService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await removeExcelSkuMapping({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = removeExcelSkuMappingHandler;

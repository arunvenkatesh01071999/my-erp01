const supplierServices = require("../services/supplierService");

function excelSkuMappingHandler(fastify) {
    const excelSkuMapping = supplierServices.excelSkuMappingService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await excelSkuMapping({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = excelSkuMappingHandler;

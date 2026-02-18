const supplierServices = require("../services/supplierService");

function getExcelSkuMappingHandler(fastify) {
    const getExcelSkuMapping = supplierServices.getExcelSkuMappingService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getExcelSkuMapping({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getExcelSkuMappingHandler;

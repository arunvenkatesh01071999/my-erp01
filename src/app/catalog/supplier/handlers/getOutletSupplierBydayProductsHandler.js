const supplierServices = require("../services/supplierService");

function getOutletSupplierBydayProductsHandler(fastify) {
    const getOutletSupplierBydayProducts = supplierServices.getOutletSupplierByDayProductsService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, query } = request;
        const response = await getOutletSupplierBydayProducts({ body, params, logTrace, query });
        return reply.code(200).send(response);
    };
}

module.exports = getOutletSupplierBydayProductsHandler;

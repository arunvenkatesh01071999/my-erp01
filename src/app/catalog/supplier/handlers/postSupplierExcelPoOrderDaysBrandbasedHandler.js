const supplierServices = require("../services/supplierService");

function postSupplierExcelPoOrderDaysBrandbasedHandler(fastify) {
    const postSupplierExcelPoOrderDaysBrandbasedService = supplierServices.postSupplierExcelPoOrderDaysBrandbasedService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postSupplierExcelPoOrderDaysBrandbasedService({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postSupplierExcelPoOrderDaysBrandbasedHandler;





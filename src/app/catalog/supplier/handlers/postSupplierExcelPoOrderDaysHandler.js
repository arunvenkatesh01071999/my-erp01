const supplierServices = require("../services/supplierService");

function postSupplierExcelPoOrderDaysHandler(fastify) {
    const postExcelSupplierPoOrderDays = supplierServices.postSupplierExcelPoOrderDaysService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postExcelSupplierPoOrderDays({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postSupplierExcelPoOrderDaysHandler;





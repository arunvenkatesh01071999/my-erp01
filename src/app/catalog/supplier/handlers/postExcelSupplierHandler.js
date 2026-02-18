const supplierServices = require("../services/supplierService");

function postExcelSupplierHandler(fastify) {
    const postExcelSupplier = supplierServices.postExcelSupplierService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postExcelSupplier({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postExcelSupplierHandler;

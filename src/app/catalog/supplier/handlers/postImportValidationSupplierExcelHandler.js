const supplierServices = require("../services/supplierService");

function postImportValidationSupplierExcelHandler(fastify) {
  const postImportValidationSupplierExcel = supplierServices.postImportValidationSupplierExcelService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postImportValidationSupplierExcel({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postImportValidationSupplierExcelHandler;

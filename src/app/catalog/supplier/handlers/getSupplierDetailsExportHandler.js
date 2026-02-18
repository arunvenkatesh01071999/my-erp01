const supplierServices = require("../services/supplierService");

function getSupplierDetailsExportHandler(fastify) {
  const getSupplierDetailsExport = supplierServices.getSupplierDetailsExportService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getSupplierDetailsExport({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getSupplierDetailsExportHandler;

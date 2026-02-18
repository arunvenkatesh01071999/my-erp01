const supplierServices = require("../services/supplierService");

function getSuplierOrderDaysWithBrandNameExportHandler(fastify) {
  const getSuplierOrderDaysWithBrandNameExportService = supplierServices.getSuplierOrderDaysWithBrandNameExportService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getSuplierOrderDaysWithBrandNameExportService({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getSuplierOrderDaysWithBrandNameExportHandler;




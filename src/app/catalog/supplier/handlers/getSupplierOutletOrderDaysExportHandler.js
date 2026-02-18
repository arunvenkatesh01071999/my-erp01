
const supplierServices = require("../services/supplierService");

function getSuplierOrderDaysWithBrandNameExportHandler(fastify) {
  const getSuplierOrderDaysWithBrandNameExportService = supplierServices.getSuplierOrderDaysWithBrandNameExportService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getSuplierOrderDaysWithBrandNameExportService({ body, params, logTrace, query });

    // ✅ FIX — wrap inside { data: ... }
    return reply.code(200).send({ data: response });
  };
}


module.exports = getSuplierOrderDaysWithBrandNameExportHandler;

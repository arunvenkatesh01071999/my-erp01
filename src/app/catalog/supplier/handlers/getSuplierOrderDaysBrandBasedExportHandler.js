const supplierServices = require("../services/supplierService");

function getSuplierOrderDaysBrandBasedExportHandler(fastify) {
  const getSuplierOrderDaysBrandBasedExportService = supplierServices.getSuplierOrderDaysBrandBasedExportService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getSuplierOrderDaysBrandBasedExportService({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getSuplierOrderDaysBrandBasedExportHandler;




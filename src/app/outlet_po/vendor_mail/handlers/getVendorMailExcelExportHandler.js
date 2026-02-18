const vendorEmailService = require("../services/vendorEmailService");

function getVendorMailExcelExportHandler(fastify) {
  const getVendorMailExcelExportService = vendorEmailService.getVendorMailExcelExportService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getVendorMailExcelExportService({
      params,
      body,
      logTrace,
      userDetails,
      query
    });
    return reply.code(200).send(response);
  };
}

module.exports = getVendorMailExcelExportHandler;

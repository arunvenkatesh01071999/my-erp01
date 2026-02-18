const vendorEmailService = require("../services/vendorEmailService.js");

function postVendorEmailExcelImportHandler(fastify) {
  const postVendorEmailExcelImportService =
    vendorEmailService.postVendorEmailExcelImportService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postVendorEmailExcelImportService({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postVendorEmailExcelImportHandler;

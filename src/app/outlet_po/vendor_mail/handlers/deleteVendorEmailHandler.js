const vendorEmailService = require("../services/vendorEmailService.js");

function deleteVendorEmailHandler(fastify) {
  const deleteVendorEmailService =
    vendorEmailService.deleteVendorEmailService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteVendorEmailService({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = deleteVendorEmailHandler;

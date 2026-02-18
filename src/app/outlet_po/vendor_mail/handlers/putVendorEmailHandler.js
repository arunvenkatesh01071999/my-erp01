const vendorEmailService = require("../services/vendorEmailService.js");

function putVendorEmailHandler(fastify) {
  const putVendorEmailService =
    vendorEmailService.putVendorEmailService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putVendorEmailService({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = putVendorEmailHandler;

const vendorEmailService = require("../services/vendorEmailService.js");

function postVendorEmailHandler(fastify) {
  const postVendorEmailService =
    vendorEmailService.postVendorEmailService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postVendorEmailService({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postVendorEmailHandler;

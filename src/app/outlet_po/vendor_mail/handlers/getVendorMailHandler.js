const vendorEmailService = require("../services/vendorEmailService");

function getVendorMailHandler(fastify) {
  const getVendorMailService = vendorEmailService.getVendorMailService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getVendorMailService({
      params,
      body,
      logTrace,
      userDetails,
      query
    });
    return reply.code(200).send(response);
  };
}

module.exports = getVendorMailHandler;

const vendorEmailService = require("../services/vendorEmailService");

function getVendorMailByIdHandler(fastify) {
  const getVendorMailByIdService = vendorEmailService.getVendorMailByIdService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getVendorMailByIdService({
      params,
      body,
      logTrace,
      userDetails,
      query
    });
    return reply.code(200).send(response);
  };
}

module.exports = getVendorMailByIdHandler;

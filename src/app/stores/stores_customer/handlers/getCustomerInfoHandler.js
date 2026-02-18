const storeCustomerService = require("../services/storeCustomerService");

function getCustomerInfoHandler(fastify) {
  const getCustomerInfoService = storeCustomerService.getCustomerInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getCustomerInfoService({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getCustomerInfoHandler;

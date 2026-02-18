const storeCustomerService = require("../services/storeCustomerService");

function getCustomerPaginateHandler(fastify) {
  const getCustomerPaginateService = storeCustomerService.getCustomerPaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getCustomerPaginateService({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getCustomerPaginateHandler;

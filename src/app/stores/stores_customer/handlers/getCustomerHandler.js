const storeCustomerService = require("../services/storeCustomerService");

function getCustomerHandler(fastify) {
  const getCustomerService = storeCustomerService.getCustomerService(fastify);

  return async (request, reply) => {
    const { logTrace } = request;
    const response = await getCustomerService({ logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getCustomerHandler;


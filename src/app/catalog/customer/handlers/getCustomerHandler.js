const customerService = require("../services/customerService");

function getCustomerHandler(fastify) {
  const getCustomer = customerService.getCustomerService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getCustomer({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getCustomerHandler;

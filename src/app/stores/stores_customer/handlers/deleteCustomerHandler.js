const storeCustomerService = require("../services/storeCustomerService");

function deleteCustomerHandler(fastify) {
  const deleteCustomerService = storeCustomerService.deleteCustomerService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteCustomerService({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deleteCustomerHandler;

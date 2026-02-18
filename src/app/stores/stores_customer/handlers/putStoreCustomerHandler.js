const storeCustomerService = require("../services/storeCustomerService");

function putStoreCustomerHandler(fastify) {
  const putStoreCustomerService = storeCustomerService.putStoreCustomerService(fastify);

  return async (request, reply) => {
    const { params,body, logTrace, userDetails } = request;
    const response = await putStoreCustomerService({
      params,body, logTrace, userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = putStoreCustomerHandler;

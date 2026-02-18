const storeCustomerService = require("../services/storeCustomerService");

function postStoreCustomerHandler(fastify) {
  const postStoreCustomerService = storeCustomerService.postStoreCustomerService(fastify);

  return async (request, reply) => {
    const { body, logTrace, userDetails } = request;
    const response = await postStoreCustomerService({
      body, logTrace, userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postStoreCustomerHandler;

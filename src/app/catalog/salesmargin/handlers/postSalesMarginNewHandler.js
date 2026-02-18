const salesmarginService = require("../services/salesmarginService");

function putSupplierHandler(fastify) {
  const putSupplier = salesmarginService.postSalesMarginNewService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putSupplier({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putSupplierHandler;

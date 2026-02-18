const supplierServices = require("../services/supplierService");

function putSupplierHandler(fastify) {
  const putSupplier = supplierServices.putSupplierService(fastify);

  return async (request, reply) => {
    const { params, body, query, logTrace, userDetails } = request;
    const response = await putSupplier({ params, body, query, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putSupplierHandler;

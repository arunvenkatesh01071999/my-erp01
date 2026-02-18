const supplierServices = require("../services/supplierService");

function getSupplierHandler(fastify) {
  const getSupplier = supplierServices.getSupplierService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getSupplier({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getSupplierHandler;

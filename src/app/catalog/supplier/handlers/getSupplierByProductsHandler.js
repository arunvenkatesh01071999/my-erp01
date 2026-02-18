const supplierServices = require("../services/supplierService");

function getSupplierByProductsHandler(fastify) {
  const getSupplierByProducts = supplierServices.getSupplierByProductsService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getSupplierByProducts({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getSupplierByProductsHandler;

const supplierServices = require("../services/supplierService");

function getOutletSupplierByProductsHandler(fastify) {
  const getOutletSupplierByProducts = supplierServices.getOutletSupplierByProductsService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getOutletSupplierByProducts({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletSupplierByProductsHandler;

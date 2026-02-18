const supplierServices = require("../services/supplierService");

function getSupplierByOutletsHandler(fastify) {
  const getSupplierByOutlets = supplierServices.getSupplierByOutletsService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getSupplierByOutlets({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getSupplierByOutletsHandler;

const supplierServices = require("../services/supplierService");

function deleteSupplierHandler(fastify) {
  const deleteSupplier = supplierServices.deleteSupplierService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteSupplier({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deleteSupplierHandler;

const supplierServices = require("../services/supplierService");

function postSupplierHandler(fastify) {
  const postSupplier = supplierServices.postSupplierService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace,userDetails } = request;
    const response = await postSupplier({ params, body, logTrace,userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postSupplierHandler;

const supplierServices = require("../services/supplierService");

function getSupplierApprovalHandler(fastify) {
  const getSupplierApproval = supplierServices.getSupplierApprovalService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getSupplierApproval({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getSupplierApprovalHandler;

const outletServices = require("../services/outletServices");

function getOutletListBySupplierHandler(fastify) {
  const getOutletListBySupplier = outletServices.getOutletListBySupplierService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await getOutletListBySupplier({ body, params, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletListBySupplierHandler;

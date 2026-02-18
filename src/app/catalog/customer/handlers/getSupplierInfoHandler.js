const supplierServices = require("../services/supplierService");

function getSupplierInfoHandler(fastify) {
  const getWareHouseInfo = supplierServices.getSupplierInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getWareHouseInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getSupplierInfoHandler;

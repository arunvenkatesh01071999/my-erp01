const salesServices = require("../services/salesReturnMasterServices");

function getSales(fastify) {
  const getSalesMaster = salesServices.getSalesReturnService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getSalesMaster({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getSales;

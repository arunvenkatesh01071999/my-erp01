const getOutletSalesMasterServices = require("../services/getOutletSalesMasterServices");

function getOutletSalesMasterHandler(fastify) {
  const getOutletSalesMaster = getOutletSalesMasterServices.getOutletSalesMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getOutletSalesMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletSalesMasterHandler;

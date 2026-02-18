const getOutletSalesReturnMasterServices = require("../services/getOutletSalesReturnMasterServices");

function getOutletSalesMasterHandler(fastify) {
  const getOutletSalesMaster = getOutletSalesReturnMasterServices.getOutletSalesReturnServiceByOutletId(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getOutletSalesMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}


module.exports = getOutletSalesMasterHandler;

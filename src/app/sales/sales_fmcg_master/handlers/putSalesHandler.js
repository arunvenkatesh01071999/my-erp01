const salesMasterServices = require("../services/salesMasterServices");

function putSalesMasterHandler(fastify) {
  const putSalesMaster = salesMasterServices.putSalesMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putSalesMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putSalesMasterHandler;

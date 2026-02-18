const salesMasterServices = require("../services/salesMasterServices");

function deleteSalesMasterHandler(fastify) {
  const deleteSalesMaster = salesMasterServices.deleteSalesMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteSalesMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deleteSalesMasterHandler;

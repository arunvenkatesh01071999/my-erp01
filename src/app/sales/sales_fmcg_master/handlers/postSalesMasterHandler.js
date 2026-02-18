const salesMasterServices = require("../services/salesMasterServices");

function postSalesMasterHandler(fastify) {
  const postSalesMaster = salesMasterServices.postSalesMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace,userDetails } = request;
    const response = await postSalesMaster({ params, body, logTrace,userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postSalesMasterHandler;

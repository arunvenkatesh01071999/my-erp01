const getOutletSalesMasterServices = require("../services/getOutletSalesMasterServices");

function postOutletSalesMasterHandler(fastify) {
  const postOutletSalesMaster = getOutletSalesMasterServices.postOutletSalesMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace,userDetails } = request;
    const response = await postOutletSalesMaster({ params, body, logTrace,userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postOutletSalesMasterHandler;

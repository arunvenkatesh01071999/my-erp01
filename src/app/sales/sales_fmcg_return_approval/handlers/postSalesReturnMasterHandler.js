const SalesReturnMasterServices = require("../services/salesReturnMasterServices");

function postSalesReturnMasterHandler(fastify) {
  const postSalesReturnMaster = SalesReturnMasterServices.postSalesReturnMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace,userDetails } = request;
    const response = await postSalesReturnMaster({ params, body, logTrace,userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postSalesReturnMasterHandler;

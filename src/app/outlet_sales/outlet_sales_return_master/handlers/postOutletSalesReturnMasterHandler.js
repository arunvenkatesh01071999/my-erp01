const getOutletSalesReturnMasterServices = require("../services/getOutletSalesReturnMasterServices");

function postOutletSalesReturnMasterHandler(fastify) {
  const postOutletSalesReturnMaster = getOutletSalesReturnMasterServices.postOutletSalesReturnMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postOutletSalesReturnMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postOutletSalesReturnMasterHandler;

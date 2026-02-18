const getOutletToOutletTransferMasterServices = require("../services/getOutletToOutletTransferMasterServices.js");

function postOutletToOutletTransferMasterHandler(fastify) {
  const postOutletToOutletTransferMaster = getOutletToOutletTransferMasterServices.postOutletToOutletTransferMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postOutletToOutletTransferMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postOutletToOutletTransferMasterHandler;

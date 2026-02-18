const getOutletToOutletTransferMasterServices = require("../services/getOutletToOutletTransferMasterServices.js");

function postOutletToOutletTransferIsOwnedMasterHandler(fastify) {
  const postOutletToOutletTransferIsOwnedMaster = getOutletToOutletTransferMasterServices.postOutletToOutletTransferIsOwnedMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postOutletToOutletTransferIsOwnedMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postOutletToOutletTransferIsOwnedMasterHandler;

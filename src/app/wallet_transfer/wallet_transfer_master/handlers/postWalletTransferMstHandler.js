const getWalletTransferMstServices = require("../services/getWalletTransferMstServices.js");

function postWalletTransferMstHandler(fastify) {
  const postWalletTransferMst = getWalletTransferMstServices.postWalletTransferMstService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postWalletTransferMst({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postWalletTransferMstHandler;

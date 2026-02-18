const getWalletTransferMstRepo = require("../repository/getWalletTransferMstRepo.js");



function postWalletTransferMstService(fastify) {
  const { postWalletTransferMst } = getWalletTransferMstRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postWalletTransferMst.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


module.exports = {
  postWalletTransferMstService
};

const getOutletToOutletTransferMasterRepo = require("../repository/getOutletToOutletTransferMasterRepo");



function postOutletToOutletTransferMasterService(fastify) {
  const { postOutletToOutletTransferMaster } = getOutletToOutletTransferMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postOutletToOutletTransferMaster.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function postOutletToOutletTransferIsOwnedMasterService(fastify) {
  const { postOutletToOutletTransferMasterIsOwned } = getOutletToOutletTransferMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postOutletToOutletTransferMasterIsOwned.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

module.exports = {
  postOutletToOutletTransferMasterService,
  postOutletToOutletTransferIsOwnedMasterService
};

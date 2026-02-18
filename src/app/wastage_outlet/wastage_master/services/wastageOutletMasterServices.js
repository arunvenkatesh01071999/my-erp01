const WastageOutletMasterRepo = require("../repository/wastageOutletMaster");



function postWastageOutletMasterService(fastify) {
  const { postWastageOutletMaster } = WastageOutletMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postWastageOutletMaster.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}



module.exports = {
  postWastageOutletMasterService
};

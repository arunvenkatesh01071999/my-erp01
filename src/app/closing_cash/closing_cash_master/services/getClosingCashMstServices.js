const getClosingCashMstRepo = require("../repository/getClosingCashMstRepo");



function postClosingCashMstService(fastify) {
  const { postClosingCashMst } = getClosingCashMstRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postClosingCashMst.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


module.exports = {
  postClosingCashMstService
};

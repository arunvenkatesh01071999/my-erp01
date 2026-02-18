const getClosingExpencesMstRepo = require("../repository/getClosingExpencesWhMstRepo.js");



function postClosingExpencesWhMstService(fastify) {
  const { postClosingExpencesWhMst } = getClosingExpencesMstRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postClosingExpencesWhMst.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function postClosingExpencesMstGetOneService(fastify) {
  const { postClosingExpencesMstGetOne } = getClosingExpencesMstRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postClosingExpencesMstGetOne.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function postClosingBankAmountService(fastify) {
  const { postClosingBankAmount } = getClosingExpencesMstRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postClosingBankAmount.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

module.exports = {
  postClosingBankAmountService,
  postClosingExpencesWhMstService,
  postClosingExpencesMstGetOneService
};

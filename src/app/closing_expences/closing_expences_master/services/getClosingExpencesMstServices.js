const getClosingExpencesMstRepo = require("../repository/getClosingExpencesMstRepo");



function postClosingExpencesMstService(fastify) {
  const { postClosingExpencesMst } = getClosingExpencesMstRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postClosingExpencesMst.call(knex, {
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
  postClosingExpencesMstService,
  postClosingExpencesMstGetOneService
};

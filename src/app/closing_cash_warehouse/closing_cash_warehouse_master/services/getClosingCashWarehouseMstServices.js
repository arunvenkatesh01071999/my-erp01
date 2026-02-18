const getClosingCashWarehouseMstRepo = require("../repository/getClosingCashWarehouseMstRepo.js");



function postClosingCashWarehouseMstService(fastify) {
  const { postClosingCashWarehouseMst } = getClosingCashWarehouseMstRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postClosingCashWarehouseMst.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


module.exports = {
  postClosingCashWarehouseMstService
};

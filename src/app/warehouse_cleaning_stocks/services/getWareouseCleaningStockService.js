const getWareouseCleaningStockRepo = require("../repository/getWareouseCleaningStockRepo");



function postWareouseCleaningStockService(fastify) {
  const { postWareouseCleaningStockRepo } = getWareouseCleaningStockRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postWareouseCleaningStockRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}



module.exports = {
  postWareouseCleaningStockService
};


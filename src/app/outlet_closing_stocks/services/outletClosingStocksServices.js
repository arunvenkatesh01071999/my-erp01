const outletClosingStocksRepo = require("../repository/outletClosingStocksRepo");


function postOutletClosingStocksService(fastify) {
  const { postOutletClosingStocksRepo } = outletClosingStocksRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postOutletClosingStocksRepo.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}



module.exports = {
  postOutletClosingStocksService
};

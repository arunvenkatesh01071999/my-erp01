const getStockMissingMstRepo = require("../repository/getStockMissingMstRepo");



function postStockMissingMstService(fastify) {
  const { postStockMissingMst } = getStockMissingMstRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postStockMissingMst.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function postStackScanService(fastify) {
  const { postStockScan } = getStockMissingMstRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postStockScan.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}



module.exports = {
  postStockMissingMstService,
  postStackScanService,
};

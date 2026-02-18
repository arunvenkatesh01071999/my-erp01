const getClosingStockOutletRepo = require("../repository/getClosingStockOutletRepo.js");



function postClosingStockOutletService(fastify) {
  const { postClosingStockOutlet } = getClosingStockOutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postClosingStockOutlet.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function postClosingStockWarehouseService(fastify) {
  const { postClosingStockWarehouse } = getClosingStockOutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postClosingStockWarehouse.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function postClosingStockOutletMissingService(fastify) {
  const { postClosingStockOutletMissing } = getClosingStockOutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postClosingStockOutletMissing.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

module.exports = {
  postClosingStockOutletService,
  postClosingStockOutletMissingService,
  postClosingStockWarehouseService
};

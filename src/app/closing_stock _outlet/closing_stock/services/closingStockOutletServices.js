const ClosingStockOutletRepo = require("../repository/closingStockOutlet");



function postClosingStockOutletService(fastify) {
  const { postClosingStock } = ClosingStockOutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postClosingStock.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getPendingStockService(fastify) {
  const { getPendingStock } = ClosingStockOutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getPendingStock.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getPendingStockViewNewService(fastify) {
  const { getPendingStockViewNew } = ClosingStockOutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getPendingStockViewNew.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function postPendingStockToCloshingStockService(fastify) {
  const { postPendingStockToCloshingStock } = ClosingStockOutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postPendingStockToCloshingStock.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function postPendingStockToMissingStockService(fastify) {
  const { postPendingStockToMissingStock } = ClosingStockOutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postPendingStockToMissingStock.call(knex, {
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
  getPendingStockService,
  postPendingStockToCloshingStockService,
  postPendingStockToMissingStockService,
  getPendingStockViewNewService
};

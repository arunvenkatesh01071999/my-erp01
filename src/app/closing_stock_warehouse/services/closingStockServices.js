const ClosingStockRepo = require("../repository/closingStock");


function postClosingStockTempWService(fastify) {
  const { postClosingStockTempW } = ClosingStockRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postClosingStockTempW.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function deleteClosingStockTempWService(fastify) {
  const { deleteClosingStockTempW } = ClosingStockRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = deleteClosingStockTempW.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteAllClosingStockTempWService(fastify) {
  const { deleteAllClosingStockTempW } = ClosingStockRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = deleteAllClosingStockTempW.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function postClosingStockCountWService(fastify) {
  const { postClosingStockCountW } = ClosingStockRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postClosingStockCountW.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getClosingStockTempDetailsWService(fastify) {
  const { getClosingStockTempDetailsW } = ClosingStockRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getClosingStockTempDetailsW.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


module.exports = {
  postClosingStockCountWService,
  postClosingStockTempWService,
  getClosingStockTempDetailsWService,
  deleteClosingStockTempWService,
  deleteAllClosingStockTempWService
};

const ClosingStockRepo = require("../repository/closingStock");



function postClosingStockService(fastify) {
  const { postClosingStock } = ClosingStockRepo(fastify);
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


function postClosingStockTempService(fastify) {
  const { postClosingStockTemp } = ClosingStockRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postClosingStockTemp.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function deleteClosingStockTempService(fastify) {
  const { deleteClosingStockTemp } = ClosingStockRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = deleteClosingStockTemp.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteAllClosingStockTempService(fastify) {
  const { deleteAllClosingStockTemp } = ClosingStockRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = deleteAllClosingStockTemp.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteAllClosingStockOutletService(fastify) {
  const { deleteAllClosingStockOutlet } = ClosingStockRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = deleteAllClosingStockOutlet.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteAllMissingStockService(fastify) {
  const { deleteAllMissingStock } = ClosingStockRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = deleteAllMissingStock.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function postClosingStockCountService(fastify) {
  const { postClosingStockCount } = ClosingStockRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postClosingStockCount.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function postAvailableStockCountService(fastify) {
  const { postAvailableStockCount } = ClosingStockRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postAvailableStockCount.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getClosingStockTempDetailsService(fastify) {
  const { getClosingStockTempDetails } = ClosingStockRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getClosingStockTempDetails.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


module.exports = {
  postClosingStockService,
  postClosingStockCountService,
  postClosingStockTempService,
  getClosingStockTempDetailsService,
  deleteClosingStockTempService,
  deleteAllClosingStockTempService,
  deleteAllClosingStockOutletService,
  deleteAllMissingStockService,
  postAvailableStockCountService
};

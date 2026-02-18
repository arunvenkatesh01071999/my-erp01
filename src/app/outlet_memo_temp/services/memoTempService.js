const memoTempRepo = require("../repository/memoTempRepo");



function postOutletPurchaseMemoTempService(fastify) {
  const { postOutletPurchaseMemoTempRepo } = memoTempRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postOutletPurchaseMemoTempRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getOutletPurchaseMemoTempService(fastify) {
  const { getOutletPurchaseMemoTempRepo } = memoTempRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getOutletPurchaseMemoTempRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getAllOutletPurchaseMemoTempService(fastify) {
  const { getAllOutletPurchaseMemoTempRepo } = memoTempRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getAllOutletPurchaseMemoTempRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function deleteOutletPurchaseMemoTempService(fastify) {
  const { deleteOutletPurchaseMemoTempRepo } = memoTempRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = deleteOutletPurchaseMemoTempRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getOutletPurchaseMemoProductTempService(fastify) {
  const { getOutletPurchaseMemoProductTempRepo } = memoTempRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getOutletPurchaseMemoProductTempRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteOutletPurchaseMemoProductTempService(fastify) {
  const { deleteOutletPurchaseMemoProductTempRepo } = memoTempRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = deleteOutletPurchaseMemoProductTempRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getAllOutletPurchaseMemoSummaryTempService(fastify) {
  const { getAllOutletPurchaseMemoSummaryTempRepo } = memoTempRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getAllOutletPurchaseMemoSummaryTempRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getOutletPurchaseMemoTempReportService(fastify) {
  const { getOutletPurchaseMemoTempReportRepo } = memoTempRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getOutletPurchaseMemoTempReportRepo.call(knex, {
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
  postOutletPurchaseMemoTempService,
  getOutletPurchaseMemoTempService,
  getAllOutletPurchaseMemoTempService,
  deleteOutletPurchaseMemoTempService,
  getOutletPurchaseMemoProductTempService,
  deleteOutletPurchaseMemoProductTempService,
  getAllOutletPurchaseMemoSummaryTempService,
  getOutletPurchaseMemoTempReportService
};


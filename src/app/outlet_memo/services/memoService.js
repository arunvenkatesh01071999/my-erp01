const memoRepo = require("../repository/memoRepo");

const getFinancialYear = (date = new Date()) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (month >= 4) {
    return `${year}_${year + 1}`;
  } else {
    return `${year - 1}_${year}`;
  }
};

function getOutletMemoSupplierListService(fastify) {
  const { getOutletMemoSupplierListRepo } = memoRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getOutletMemoSupplierListRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getOutletMemoPoNoListService(fastify) {
  const { getOutletMemoPoNoListRepo } = memoRepo(fastify);
  return async ({ params, logTrace, body, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getOutletMemoPoNoListRepo.call(knex, {
      params,
      logTrace,
      body,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getOutletMemoPoItemListService(fastify) {
  const { getOutletMemoPoItemListRepo } = memoRepo(fastify);
  return async ({ body, params, logTrace, query, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getOutletMemoPoItemListRepo.call(knex, {
      params,
      body,
      queryString: query,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function postOutletPurchaseMemoService(fastify) {
  const { postOutletPurchaseMemoRepo } = memoRepo(fastify);
  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();

    const promise1 = postOutletPurchaseMemoRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      financialYear
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getOutletPurchaseMemoDetailsService(fastify) {
  const { getOutletPurchaseMemoDetailsRepo } = memoRepo(fastify);
  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getOutletPurchaseMemoDetailsRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function putOutletPurchaseMemoInvoicePdfService(fastify) {
  const { putOutletPurchaseMemoInvoicePdfRepo } = memoRepo(fastify);
  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = putOutletPurchaseMemoInvoicePdfRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putOutletPurchaseMemoInvoicePdfUploadService(fastify) {
  const { putOutletPurchaseMemoInvoicePdfUploadRepo } = memoRepo(fastify);
  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = putOutletPurchaseMemoInvoicePdfUploadRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getOutletMemoInvoicePdfUploadSummaryListService(fastify) {
  const { getOutletMemoInvoicePdfUploadSummaryListRepo } = memoRepo(fastify);
  return async ({ body, params, logTrace, userDetails, query }) => {
    const knex = fastify.knexMedical;
    const promise1 = getOutletMemoInvoicePdfUploadSummaryListRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      querystring: query
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function putOutletPurchaseMemoInvoiceNoService(fastify) {
  const { putOutletPurchaseMemoInvoiceNoRepo } = memoRepo(fastify);
  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = putOutletPurchaseMemoInvoiceNoRepo.call(knex, {
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
  getOutletMemoSupplierListService,
  getOutletMemoPoNoListService,
  getOutletMemoPoItemListService,
  postOutletPurchaseMemoService,
  getOutletPurchaseMemoDetailsService,
  putOutletPurchaseMemoInvoicePdfService,
  putOutletPurchaseMemoInvoicePdfUploadService,
  getOutletMemoInvoicePdfUploadSummaryListService,
  putOutletPurchaseMemoInvoiceNoService
};

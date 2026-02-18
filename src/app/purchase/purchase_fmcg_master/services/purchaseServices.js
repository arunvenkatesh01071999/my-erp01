const purchaseRepo = require("../repository/purchase");
const partyledgerRepo = require("../../../partyledger/repository/partyledger")

const getFinancialYear = (date = new Date()) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (month >= 4) {
    return `${year}_${year + 1}`;
  } else {
    return `${year - 1}_${year}`;
  }
};

function postPurchaseDetailsService(fastify) {
  const { postpurchase } = purchaseRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postpurchase.call(knex, {
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

function putPurchaseDetailsService(fastify) {
  const { putPurchaseDetailsRepo } = purchaseRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = putPurchaseDetailsRepo.call(knex, {
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

function getPurchaseGrnService(fastify) {
  const { getPurchaseGrnRepo } = purchaseRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getPurchaseGrnRepo.call(knex, {
      body,
      params,
      logTrace,
      query
    });
    return response;

  };
}

function getPurchaseByIdService(fastify) {
  const { getPurchaseByIdRepo } = purchaseRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getPurchaseByIdRepo.call(knex, {
      body,
      params,
      logTrace,
      query
    });
    return response;

  };
}

function deletePurchaseService(fastify) {
  const { deletePurchaseDetailsRepo } = purchaseRepo(fastify);

  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await deletePurchaseDetailsRepo.call(knex, {
      body,
      params,
      logTrace,
      userDetails
    });
    return response;

  };
}

function getPurchaseGrnListService(fastify) {
  const { getPurchaseGrnListRepo } = purchaseRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getPurchaseGrnListRepo.call(knex, {
      body,
      params,
      logTrace
    });
    return response;

  };
}

function getPurchaseGrnEditListService(fastify) {
  const { getPurchaseEditListRepo } = purchaseRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getPurchaseEditListRepo.call(knex, {
      body,
      params,
      logTrace,
      query
    });
    return response;

  };
}

function generatePurchasenoService(fastify) {
  const { getPurchaseno } = purchaseRepo(fastify);
  const financialYear = getFinancialYear();
  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getPurchaseno.call(knex, {
      body,
      params,
      logTrace,
      query,
      financialYear
    });
    return response;

  };
}

module.exports = {
  postPurchaseDetailsService,
  putPurchaseDetailsService,
  getPurchaseGrnService,
  getPurchaseGrnListService,
  deletePurchaseService,
  getFinancialYear,
  generatePurchasenoService,
  getPurchaseByIdService,
  getPurchaseGrnEditListService
};

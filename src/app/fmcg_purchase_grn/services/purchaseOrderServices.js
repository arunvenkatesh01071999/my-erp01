const purchaseGrnRepo = require("../repository/purchaseGrnRepo.js");
const getFinancialYear = (date = new Date()) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (month >= 4) {
    return `${year}_${year + 1}`;
  } else {
    return `${year - 1}_${year}`;
  }
};

function postPurchaseGrnFmcgProductService(fastify) {
  const { postPurchaseGrnFmcgProductRepo } = purchaseGrnRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postPurchaseGrnFmcgProductRepo.call(knex, {
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

function putPurchaseGrnFmcgProductService(fastify) {
  const { putPurchaseGrnFmcgProductService } = purchaseGrnRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = putPurchaseGrnFmcgProductService.call(knex, {
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

function deletePurchaseGrnFmcgProductService(fastify) {
  const { deletePurchaseGrnFmcgProductRepo } = purchaseGrnRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = deletePurchaseGrnFmcgProductRepo.call(knex, {
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

function postPurchaseGrnFvProductService(fastify) {
  const { postPurchaseGrnFvProductRepo } = purchaseGrnRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postPurchaseGrnFvProductRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });

    const [response] = await Promise.all([promise1]);

    return response;
  };
}

function getPurchaseGrnFvProductService(fastify) {
  const { getPurchaseGrnFvProductRepo } = purchaseGrnRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getPurchaseGrnFvProductRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getPurchaseOrderApprovedPoService(fastify) {
  const { getPurchaseOrderApprovedPo } = purchaseGrnRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getPurchaseOrderApprovedPo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getPurchaseGrnByIdService(fastify) {
  const { getPurchaseGrnByIdRepo } = purchaseGrnRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getPurchaseGrnByIdRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getPurchaseGrnListService(fastify) {
  const { getPurchaseGrnListRepo } = purchaseGrnRepo(fastify);
  return async ({ params, body, logTrace, userDetails, query }) => {
    const knex = fastify.knexMedical;
    const promise1 = getPurchaseGrnListRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails, query
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function generateGrnNoService(fastify) {
  const { getGrnno } = purchaseGrnRepo(fastify);
  return async ({ params, body, logTrace, userDetails, query }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = getGrnno.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      financialYear,
      query
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}




module.exports = {
  postPurchaseGrnFmcgProductService,
  postPurchaseGrnFvProductService,
  getPurchaseGrnFvProductService,
  putPurchaseGrnFmcgProductService,
  getPurchaseOrderApprovedPoService,
  deletePurchaseGrnFmcgProductService,
  getPurchaseGrnListService,
  getPurchaseGrnByIdService,
  generateGrnNoService
};

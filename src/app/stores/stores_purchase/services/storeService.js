const storeRepo = require("../repository/storeRepo");

const getFinancialYear = (date = new Date()) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (month >= 4) {
    return `${year}_${year + 1}`;
  } else {
    return `${year - 1}_${year}`;
  }
};


function postStoreManualPurchaseService(fastify) {
  const { postStoreManualPurchaseRepo } = storeRepo(fastify);
  return async ({ body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postStoreManualPurchaseRepo.call(knex, {
      body,
      logTrace,
      userDetails,
      financialYear
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function postStorePoPurchaseService(fastify) {
  const { postStorePoPurchaseRepo } = storeRepo(fastify);
  return async ({ body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postStorePoPurchaseRepo.call(knex, {
      body,
      logTrace,
      userDetails,
      financialYear
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function postStoresPOService(fastify) {
  const { postStorePORepo } = storeRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postStorePORepo.call(knex, {
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

function putStorePoUnApprovedProductService(fastify) {
  const { putStorePoUnApprovedProduct } = storeRepo(fastify);
  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = putStorePoUnApprovedProduct.call(knex, {
      body, params, logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putStorePurchaseOrderProductService(fastify) {
  const { putStorePurchaseOrderProductRepo } = storeRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = putStorePurchaseOrderProductRepo.call(knex, {
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

function getStorePoUnApprovedProductService(fastify) {
  const { getStorePoUnApprovedProduct } = storeRepo(fastify);
  return async ({ params, body, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getStorePoUnApprovedProduct.call(knex, {
      params,
      body,
      logTrace,
      queryString: query,
      userDetails
    });

    const [response] = await Promise.all([promise1]);

    return response;
  };
}

function getStorePurchaseOrderApprovedItemService(fastify) {
  const { getStorePurchaseOrderApprovedItem } = storeRepo(fastify);
  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getStorePurchaseOrderApprovedItem.call(knex, {
      body,
      params,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function postStorePurchaseReturnService(fastify) {
  const { postStorePurchaseReturnRepo } = storeRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postStorePurchaseReturnRepo.call(knex, {
      params,
      body,
      logTrace,
      financialYear,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putStorePurchaseReturnService(fastify) {
  const { putStorePurchaseReturnDetailsRepo } = storeRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = putStorePurchaseReturnDetailsRepo.call(knex, {
      params,
      body,
      logTrace,
      financialYear,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteStorePurchaseReturnService(fastify) {
  const { deleteStorePurchaseReturnDetailsRepo } = storeRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = deleteStorePurchaseReturnDetailsRepo.call(knex, {
      params,
      body,
      logTrace,
      financialYear,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getStorePurchaseReturnByIdService(fastify) {
  const { getStorePurchaseReturnByIdRepo } = storeRepo(fastify);
  return async ({ body, params, query, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getStorePurchaseReturnByIdRepo.call(knex, {
      body,
      params,
      queryString: query,
      logTrace
    });
    return response;

  };
}


module.exports = {

  postStoreManualPurchaseService,
  postStoresPOService,
  getStorePoUnApprovedProductService,
  getStorePurchaseOrderApprovedItemService,
  putStorePurchaseOrderProductService,
  putStorePoUnApprovedProductService,
  postStorePoPurchaseService,
  postStorePurchaseReturnService,
  putStorePurchaseReturnService,
  deleteStorePurchaseReturnService,
  getStorePurchaseReturnByIdService
};

const purchaseOrderRepo = require("../repository/fmcgPurchaseOrderRepo.js");

const getFinancialYear = (date = new Date()) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (month >= 4) {
    return `${year}_${year + 1}`;
  } else {
    return `${year - 1}_${year}`;
  }
};


function getPurchaseOrderPonoService(fastify) {
  const { getPurchaseOrderPono } = purchaseOrderRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = getPurchaseOrderPono.call(knex, {
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

function getProductBySupplierService(fastify) {
  const { getProductBySupplierRepo } = purchaseOrderRepo(fastify);
  return async ({ params, body, logTrace, userDetails, query }) => {
    const knex = fastify.knexMedical;

    const promise1 = getProductBySupplierRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      query
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function postPurchaseOrderProductService(fastify) {
  const { postPurchaseOrderProduct } = purchaseOrderRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postPurchaseOrderProduct.call(knex, {
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

function getPoUnApprovedProductService(fastify) {
  const { getPoUnApprovedProduct } = purchaseOrderRepo(fastify);
  return async ({ params, body, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getPoUnApprovedProduct.call(knex, {
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


function putPoUnApprovedProductService(fastify) {
  const { putPoUnApprovedProduct } = purchaseOrderRepo(fastify);
  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = putPoUnApprovedProduct.call(knex, {
      body, params, logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function putPoSettingService(fastify) {
  const { putPoSetting } = purchaseOrderRepo(fastify);
  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = putPoSetting.call(knex, {
      body, params, logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getPoSettingService(fastify) {
  const { getPoSetting } = purchaseOrderRepo(fastify);
  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getPoSetting.call(knex, {
      body, params, logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}



function getPurchaseOrderApprovedItemService(fastify) {
  const { getPurchaseOrderApprovedItem } = purchaseOrderRepo(fastify);
  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getPurchaseOrderApprovedItem.call(knex, {
      body,
      params,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getPurchaseOrderApprovedPonoService(fastify) {
  const { getPurchaseOrderApprovedPono } = purchaseOrderRepo(fastify);
  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getPurchaseOrderApprovedPono.call(knex, {
      body, params, logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getProductExpiryBySupplierService(fastify) {
  const { getProductExpiryBySupplierRepo } = purchaseOrderRepo(fastify);
  return async ({ params, body, logTrace, userDetails, query }) => {
    const knex = fastify.knexMedical;

    const promise1 = getProductExpiryBySupplierRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      query
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deletePurchaseOrderProductService(fastify) {
  const { deletePurchaseOrderProductRepo } = purchaseOrderRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = deletePurchaseOrderProductRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putPurchaseOrderProductService(fastify) {
  const { putPurchaseOrderProductRepo } = purchaseOrderRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = putPurchaseOrderProductRepo.call(knex, {
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

function getPurchaseOrderUnApprovedListService(fastify) {
  const { getPurchaseOrderUnApprovedListRepo } = purchaseOrderRepo(fastify);
  return async ({ params, body, logTrace, userDetails, query }) => {
    const knex = fastify.knexMedical;

    const promise1 = getPurchaseOrderUnApprovedListRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      query
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}



module.exports = {
  getProductBySupplierService,
  postPurchaseOrderProductService,
  getPoUnApprovedProductService,
  putPoUnApprovedProductService,
  putPoSettingService,
  getPurchaseOrderPonoService,
  getPoSettingService,
  getPurchaseOrderApprovedItemService,
  getPurchaseOrderApprovedPonoService,
  getProductExpiryBySupplierService,
  deletePurchaseOrderProductService,
  putPurchaseOrderProductService,
  getPurchaseOrderUnApprovedListService
};

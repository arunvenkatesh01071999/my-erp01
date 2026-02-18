const salesMasterRepo = require("../repository/salesMaster");
const getFinancialYear = (date = new Date()) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (month >= 4) {
    return `${year}_${year + 1}`;
  } else {
    return `${year - 1}_${year}`;
  }
};

function postSalesMasterService(fastify) {
  const { postSalesMaster } = salesMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postSalesMaster.call(knex, {
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

function putSalesMasterService(fastify) {
  const { putSalesMasterRepo } = salesMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = putSalesMasterRepo.call(knex, {
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

function getSalesByIdService(fastify) {
  const { getSalesByIdRepo } = salesMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = getSalesByIdRepo.call(knex, {
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

function deleteSalesMasterService(fastify) {
  const { deleteSalesDetailsRepo } = salesMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = deleteSalesDetailsRepo.call(knex, {
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

function getCustomerMappingService(fastify) {
  const { getCustomerMasterRepo } = salesMasterRepo(fastify);

  return async ({ logTrace, params, query }) => {
    const knex = fastify.knexMedical;
    const response = await getCustomerMasterRepo.call(knex, {
      logTrace,
      params,
      queryString: query
    });
    return response;

  };
}

function getSalesEditListService(fastify) {
  const { getSalesEditListRepo } = salesMasterRepo(fastify);

  return async ({ params, body, logTrace, userDetails, query }) => {
    const knex = fastify.knexMedical;
    const response = await getSalesEditListRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      query
    });
    return response;

  };
}

function getCustomerDetailsService(fastify) {
  const { getCustomerDetailsRepo } = salesMasterRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getCustomerDetailsRepo.call(knex, {
      logTrace
    });
    return response;

  };
}

function getProductDetailsService(fastify) {
  const { getProductDetailsRepo } = salesMasterRepo(fastify);

  return async ({ logTrace, params, query }) => {
    const knex = fastify.knexMedical;
    const response = await getProductDetailsRepo.call(knex, {
      logTrace,
      params,
      queryString: query
    });
    return response;

  };
}


function getExportPendingListService(fastify) {
  const { getExportPendingListRepo } = salesMasterRepo(fastify);

  return async ({ logTrace, params, query }) => {
    const knex = fastify.knexMedical;
    const response = await getExportPendingListRepo.call(knex, {
      logTrace,
      params,
      queryString: query
    });
    return response;

  };
}


function putExportPendingListService(fastify) {
  const { putExportPendingRepo } = salesMasterRepo(fastify);

  return async ({ logTrace, body, params, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await putExportPendingRepo.call(knex, {
      body,
      logTrace,
      params,
      userDetails
    });
    return response;

  };
}


function generateSaleNoService(fastify) {
  const { generatSalesDocno } = salesMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = generatSalesDocno.call(knex, {
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

module.exports = {
  postSalesMasterService,
  putSalesMasterService,
  deleteSalesMasterService,
  getSalesByIdService,
  getSalesEditListService,
  getCustomerMappingService,
  generateSaleNoService,
  getCustomerDetailsService,
  getProductDetailsService,
  getExportPendingListService,
  putExportPendingListService
};

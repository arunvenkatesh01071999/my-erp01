const storeCustomerRepo = require("../repository/storeCustomerRepo");

const getFinancialYear = (date = new Date()) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (month >= 4) {
    return `${year}_${year + 1}`;
  } else {
    return `${year - 1}_${year}`;
  }
};


function postStoreCustomerService(fastify) {
  const { postStoreCustomerRepo } = storeCustomerRepo(fastify);
  return async ({ body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postStoreCustomerRepo.call(knex, {
      body,
      logTrace,
      userDetails,
      financialYear
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}



function putStoreCustomerService(fastify) {
  const { putStoreCustomerRepo } = storeCustomerRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = putStoreCustomerRepo.call(knex, {
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

function deleteCustomerService(fastify) {
  const { deleteCustomerRepo } = storeCustomerRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { customer_id } = params;
    const promise1 = deleteCustomerRepo.call(knex, {
      customer_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getCustomerInfoService(fastify) {
  const { getCustomerInfoRepo } = storeCustomerRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getCustomerInfoRepo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

function getCustomerService(fastify) {
  const { getCustomerRepo } = storeCustomerRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getCustomerRepo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}


function getCustomerPaginateService(fastify) {
  const { getCustomerPaginateRepo } = storeCustomerRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getCustomerPaginateRepo.call(knex, {
      body, params, logTrace,
      queryString: query
    });
    return response;
  };

}

module.exports = {

  postStoreCustomerService,
  putStoreCustomerService,
  deleteCustomerService,
  getCustomerInfoService,
  getCustomerService,
  getCustomerPaginateService

};

const customerRepo = require("../repository/customer");

function getCustomerService(fastify) {
  const { getCustomer } = customerRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getCustomer.call(knex, {
      logTrace
    });
    return response;

  };
}

function getSupplierPaginateService(fastify) {
  const { getSupplierPaginate } = customerRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getSupplierPaginate.call(knex, {
      body, params, logTrace,
      queryString: query
    });
    return response;
  };

}

function postSupplierService(fastify) {
  const { postSupplier } = customerRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postSupplier.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putSupplierService(fastify) {
  const { putSupplier } = customerRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { supplier_id } = params;
    const promise1 = putSupplier.call(knex, {
      supplier_id,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteSupplierService(fastify) {
  const { deleteSupplier } = customerRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { supplier_id } = params;
    const promise1 = deleteSupplier.call(knex, {
      supplier_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getSupplierInfoService(fastify) {
  const { getSupplierInfo } = customerRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSupplierInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

function getSupplierByProductsService(fastify) {
  const { getSupplierByProducts } = customerRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSupplierByProducts.call(knex, {
      logTrace
    });
    return response;

  };
}

module.exports = {
  getCustomerService,
  getSupplierPaginateService,
  postSupplierService,
  putSupplierService,
  deleteSupplierService,
  getSupplierInfoService,
  getSupplierByProductsService
};

const salesmarginRepo = require("../repository/salesmargin");

function postSalesMarginService(fastify) {
  const { postSalesMargin } = salesmarginRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postSalesMargin.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getSalesMarginService(fastify) {
  const { getSaleMarginList } = salesmarginRepo(fastify);

  return async ({ logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getSaleMarginList.call(knex, {
      logTrace,
      queryString: query
    });
    return response;

  };
}

function postSalesMarginNewService(fastify) {
  const { postSalesMarginNew } = salesmarginRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postSalesMarginNew.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getSalesMarginNewService(fastify) {
  const { getSaleMarginNewListRepo } = salesmarginRepo(fastify);

  return async ({ params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getSaleMarginNewListRepo.call(knex, {
      params,
      logTrace,
      queryString: query
    });
    return response;
  };
}


function putSupplierService(fastify) {
  const { putSupplier } = salesmarginRepo(fastify);
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
  const { deleteSupplier } = salesmarginRepo(fastify);
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

function getSupplierByProductsService(fastify) {
  const { getSupplierByProducts } = salesmarginRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSupplierByProducts.call(knex, {
      logTrace
    });
    return response;

  };
}

module.exports = {
  postSalesMarginService,
  getSalesMarginService,
  postSalesMarginNewService,
  getSalesMarginNewService,
  putSupplierService,
  deleteSupplierService,
  getSupplierByProductsService
};

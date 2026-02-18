const getClearanceSalesProductRepo = require("../repository/clearanceSalesRepo");

function postClearanceSalesProductService(fastify) {
  const { postClearanceSalesProduct } = getClearanceSalesProductRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postClearanceSalesProduct.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putClearanceSalesProductService(fastify) {
  const { putClearanceSalesProduct } = getClearanceSalesProductRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = putClearanceSalesProduct.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteClearanceSalesProductService(fastify) {
  const { deleteClearanceSalesProduct } = getClearanceSalesProductRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { doc_no, outlet_id } = params;
    const promise1 = deleteClearanceSalesProduct.call(knex, {
      doc_no,
      outlet_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getClearanceSalesProductService(fastify) {
  const { getClearanceSalesProduct } = getClearanceSalesProductRepo(fastify);

  return async ({ params, body, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getClearanceSalesProduct.call(knex, {
      params,
      body,
      queryString: query,
      logTrace
    });
    return response;
  };
}

function getClearanceSalesProductByDocnoService(fastify) {
  const { getClearanceSalesProductByDocno } = getClearanceSalesProductRepo(fastify);

  return async ({ params, body, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getClearanceSalesProductByDocno.call(knex, {
      params,
      body,
      query,
      logTrace
    });
    return response;
  };
}


module.exports = {
  postClearanceSalesProductService,
  putClearanceSalesProductService,
  deleteClearanceSalesProductService,
  getClearanceSalesProductService,
  getClearanceSalesProductByDocnoService
};

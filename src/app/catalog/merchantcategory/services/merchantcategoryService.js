const merchantCategoryRepo = require("../repository/merchantcategory");

function getMerchantCategoryService(fastify) {
  const { getMerchantCategory } = merchantCategoryRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getMerchantCategory.call(knex, {
      logTrace
    });
    return response;

  };
}

function getMerchantCategoryPaginateService(fastify) {
  const { getMerchantCategoryPaginate } = merchantCategoryRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getMerchantCategoryPaginate.call(knex, {
      body, params, logTrace,
      queryString: query
    });
    return response;
  };

}

function postMerchantCategoryService(fastify) {
  const { postMerchantCategory } = merchantCategoryRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postMerchantCategory.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putMerchantCategoryService(fastify) {
  const { putMerchantCategory } = merchantCategoryRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { merchantcategory_id } = params;
    const promise1 = putMerchantCategory.call(knex, {
      merchantcategory_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteMerchantCategoryService(fastify) {
  const { deleteMerchantCategory } = merchantCategoryRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { merchantcategory_id } = params;
    const promise1 = deleteMerchantCategory.call(knex, {
      merchantcategory_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getMerchantCategoryInfoService(fastify) {
  const { getMerchantCategoryInfo } = merchantCategoryRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getMerchantCategoryInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

function getBrandMerchantCategoryInfoService(fastify) {
  const { getBrandMerchantCategoryInfo } = merchantCategoryRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getBrandMerchantCategoryInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getMerchantCategoryService,
  postMerchantCategoryService,
  putMerchantCategoryService,
  deleteMerchantCategoryService,
  getMerchantCategoryInfoService,
  getMerchantCategoryPaginateService,
  getBrandMerchantCategoryInfoService
};

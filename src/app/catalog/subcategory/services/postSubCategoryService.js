const mainCategoryRepo = require("../repository/category");
const subCategoryRepo = require("../repository/subCategory");

function postSubCategoryService(fastify) {
  const { postSubCategories } = subCategoryRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { company_id, id, user_name } = userDetails;
    const promise1 = postSubCategories.call(knex, {
      params,
      body,
      company_id,
      id,
      user_name,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function putSubCategoryService(fastify) {
  const { putSubCategories } = subCategoryRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { subcategory_id } = params;
    const { company_id, id, user_name } = userDetails;
    const promise1 = putSubCategories.call(knex, {
      subcategory_id,
      body,
      company_id,
      id,
      user_name,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getSubCategoryService(fastify) {
  const { getSubCategories } = subCategoryRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const promise1 = getSubCategories.call(knex, {
      params,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getSubCategoryPaginateService(fastify) {
  const { getSubCategoriesPaginate } = subCategoryRepo(fastify);
  return async ({ params, body, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const promise1 = getSubCategoriesPaginate.call(knex, {
      params,
      body,
      logTrace,
      queryString: query

    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function deleteSubCategoryService(fastify) {
  const { deleteSubCategories } = subCategoryRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { subcategory_id } = params;
    const { company_id, id, user_name } = userDetails;
    const promise1 = deleteSubCategories.call(knex, {
      subcategory_id,
      body,
      id,
      user_name,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getSubCategoryInfoService(fastify) {
  const { getSubCategoriesInfo } = subCategoryRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const promise1 = getSubCategoriesInfo.call(knex, {
      params,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getCategorySubCategoryInfoService(fastify) {
  const { getCategorySubCategoriesInfo } = subCategoryRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const promise1 = getCategorySubCategoriesInfo.call(knex, {
      params,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

module.exports = {
  postSubCategoryService,
  putSubCategoryService,
  getSubCategoryService,
  deleteSubCategoryService,
  getSubCategoryInfoService,
  getSubCategoryPaginateService,
  getCategorySubCategoryInfoService
};

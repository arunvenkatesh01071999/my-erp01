const mainCategoryRepo = require("../repository/category");
const subCategoryRepo = require("../repository/subCategory");

function postCategoryService(fastify) {
  const { postCategories } = mainCategoryRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { company_id, id, user_name } = userDetails;
    // console.log(company_id, id, user_name, "values")
    const promise1 = postCategories.call(knex, {
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
function putCategoryService(fastify) {
  const { putCategories } = mainCategoryRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { category_id } = params;
    const { company_id, id, user_name } = userDetails;
    const promise1 = putCategories.call(knex, {
      category_id,
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
function getCategoryService(fastify) {
  const { getCategories } = mainCategoryRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const promise1 = getCategories.call(knex, {
      params,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getCategoryPaginateService(fastify) {
  const { getCategoriesPaginate } = mainCategoryRepo(fastify);
  return async ({ params, body, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const promise1 = getCategoriesPaginate.call(knex, {
      params,
      body,
      logTrace,
      queryString: query
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteCategoryService(fastify) {
  const { deleteCategories } = mainCategoryRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { category_id } = params;
    const { id, user_name } = userDetails;
    const promise1 = deleteCategories.call(knex, {
      category_id,
      body,
      id,
      user_name,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getCategoryInfoService(fastify) {
  const { getCategoriesInfo } = mainCategoryRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const promise1 = getCategoriesInfo.call(knex, {
      params,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getHomeCategoryService(fastify) {
  const { getHomeCategories } = mainCategoryRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const promise1 = getHomeCategories.call(knex, {
      params,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);

    const transformedData = response.filter(
      category => category.sub_categories.length > 0
    );

    // console.log(transformedData);

    return transformedData;
  };
}
module.exports = {
  postCategoryService,
  putCategoryService,
  getCategoryService,
  deleteCategoryService,
  getCategoryInfoService,
  getCategoryPaginateService,
  getHomeCategoryService
};

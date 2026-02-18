const menuAuthRepo = require("../repository/menuauth");
const { transformMenuData, rolePermissionTransformMenuData } = require("../transformer/getMenuResponseTransformer");

function postMenuAuthService(fastify) {
  const { postMenuAuth } = menuAuthRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postMenuAuth.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function menuAuthListService(fastify) {
  const { menuAuthList } = menuAuthRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = menuAuthList.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    // Transform the response data before returning
    const transformedResponse = transformMenuData(response);

    return transformedResponse;
  };
}

function getRolePermissionPaginationService(fastify) {
  const { getRolePermissionPaginationRepo } = menuAuthRepo(fastify);
  return async ({ params, body, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getRolePermissionPaginationRepo.call(knex, {
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
function getRolePermissionService(fastify) {
  const { getRolePermissionRepo } = menuAuthRepo(fastify);
  return async ({ params, body, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getRolePermissionRepo.call(knex, {
      params,
      body,
      query,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    // Transform the response data before returning
    const transformedResponse = rolePermissionTransformMenuData(response);
    return transformedResponse;
  };
}

function putRolePermissionService(fastify) {
  const { putRolePermissionRepo } = menuAuthRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = putRolePermissionRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
module.exports = {
  postMenuAuthService,
  menuAuthListService,
  getRolePermissionPaginationService,
  getRolePermissionService,
  putRolePermissionService
};

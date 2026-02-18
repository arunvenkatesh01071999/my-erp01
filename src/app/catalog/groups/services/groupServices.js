const groupRepo = require("../repository/groups");

function getGroupService(fastify) {
  const { getGroup } = groupRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getGroup.call(knex, {
      logTrace
    });
    return response;
  };
}
function getGroupPaginateService(fastify) {
  const { getGroupPaginate } = groupRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getGroupPaginate.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

function postGroupService(fastify) {
  const { postGroup } = groupRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const promise1 = postGroup.call(knex, {
      params,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function putGroupService(fastify) {
  const { putGroup } = groupRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const { group_id } = params;
    const promise1 = putGroup.call(knex, {
      group_id,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function deleteGroupService(fastify) {
  const { deleteGroup } = groupRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const { group_id } = params;
    const promise1 = deleteGroup.call(knex, {
      group_id,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getGroupInfoService(fastify) {
  const { getGroupInfo } = groupRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getGroupInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getGroupService,
  postGroupService,
  putGroupService,
  deleteGroupService,
  getGroupInfoService,
  getGroupPaginateService
};

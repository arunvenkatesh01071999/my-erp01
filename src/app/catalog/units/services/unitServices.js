const unitRepo = require("../repository/units");

function getUnitService(fastify) {
  const { getUnit } = unitRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getUnit.call(knex, {
      logTrace
    });
    return response;
  };
}
function getUnitPaginateService(fastify) {
  const { getUnitPaginate } = unitRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getUnitPaginate.call(knex, {
      body, params, logTrace,
      queryString: query
    });
    return response;
  };
}

function postUnitService(fastify) {
  const { postUnit } = unitRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postUnit.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function putUnitService(fastify) {
  const { putUnit } = unitRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { unit_id } = params;
    const promise1 = putUnit.call(knex, {
      unit_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function deleteUnitService(fastify) {
  const { deleteUnit } = unitRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { unit_id } = params;
    const promise1 = deleteUnit.call(knex, {
      unit_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getUnitInfoService(fastify) {
  const { getUnitInfo } = unitRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getUnitInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getUnitService,
  postUnitService,
  putUnitService,
  deleteUnitService,
  getUnitInfoService,
  getUnitPaginateService
};

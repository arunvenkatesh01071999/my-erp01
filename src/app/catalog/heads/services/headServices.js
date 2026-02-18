const headRepo = require("../repository/head");
const { querystring } = require("../schemas/getHeadPaginateSchema");

function getHeadService(fastify) {
  const { getHead } = headRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getHead.call(knex, {
      logTrace
    });
    return response;
  };
}

function getHeadPaginateService(fastify) {
  const { getHeadPaginate } = headRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    // console.log(query, "werty");
    const response = await getHeadPaginate.call(knex, {
      body,
      params,
      logTrace,
      queryString: query
    });
    return response;
  };
}
function postHeadService(fastify) {
  const { postHead } = headRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postHead.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function putHeadService(fastify) {
  const { putHead } = headRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { head_id } = params;
    const promise1 = putHead.call(knex, {
      head_id,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function deleteHeadService(fastify) {
  const { deleteHead } = headRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { head_id } = params;
    const promise1 = deleteHead.call(knex, {
      head_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getHeadInfoService(fastify) {
  const { getHeadInfo } = headRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getHeadInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

function getHeadBrandInfoService(fastify) {
  const { getHeadBrandInfo } = headRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getHeadBrandInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getHeadService,
  postHeadService,
  putHeadService,
  deleteHeadService,
  getHeadInfoService,
  getHeadPaginateService,
  getHeadBrandInfoService
};

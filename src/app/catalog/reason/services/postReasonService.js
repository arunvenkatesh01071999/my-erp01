const mainReasonRepo = require("../repository/reason");

function postReasonService(fastify) {
  const { postReason } = mainReasonRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { company_id, id, user_name } = userDetails;
    const promise1 = postReason.call(knex, {
      params,
      body,
      userDetails,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function putReasonService(fastify) {
  const { putReason } = mainReasonRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = putReason.call(knex, {
      params,
      body,
      userDetails,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getReasonService(fastify) {
  const { getReason } = mainReasonRepo(fastify);
  return async ({ params, body, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const promise1 = getReason.call(knex, {
      params,
      body,
      logTrace,
      queryString: query
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getReasonPaginateService(fastify) {
  const { getReasonPaginate } = mainReasonRepo(fastify);
  return async ({ params, body, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = getReasonPaginate.call(knex, {
      params,
      body,
      logTrace,
      queryString: query
    });
    return response;
  };
}

function deleteReasonService(fastify) {
  const { deleteReason } = mainReasonRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = deleteReason.call(knex, {
      params,
      body,
      userDetails,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getReasonInfoService(fastify) {
  const { getReasonInfo } = mainReasonRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const promise1 = getReasonInfo.call(knex, {
      params,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

module.exports = {
  postReasonService,
  putReasonService,
  getReasonService,
  deleteReasonService,
  getReasonInfoService,
  getReasonPaginateService,
};

const OutletMemberRepo = require("../repository/OutletMember");

function getOutletMemberService(fastify) {
  const { getOutletMember } = OutletMemberRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletMember.call(knex, {
      logTrace
    });
    return response;

  };
}

function getOutletMemberPaginateService(fastify) {
  const { getOutletMemberPaginate } = OutletMemberRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletMemberPaginate.call(knex, {
      body, params, logTrace,
      queryString: query
    });
    return response;
  };

}

function postOutletMemberService(fastify) {
  const { postOutletMember } = OutletMemberRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postOutletMember.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putOutletMemberService(fastify) {
  const { putOutletMember } = OutletMemberRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { id } = params;
    const promise1 = putOutletMember.call(knex, {
      id,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteOutletMemberService(fastify) {
  const { deleteOutletMember } = OutletMemberRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const { id } = params;
    const promise1 = deleteOutletMember.call(knex, {
      id,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getOutletMemberInfoService(fastify) {
  const { getOutletMemberInfo } = OutletMemberRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletMemberInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getOutletMemberService,
  getOutletMemberPaginateService,
  postOutletMemberService,
  putOutletMemberService,
  deleteOutletMemberService,
  getOutletMemberInfoService
};

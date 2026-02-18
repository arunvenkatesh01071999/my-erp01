const accountMasterRepo = require("../repository/accountMaster");

function getAccountMasterService(fastify) {
  const { getaccountMaster } = accountMasterRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getaccountMaster.call(knex, {
      logTrace
    });
    return response;

  };
}

function getAccountMasterPaginateService(fastify) {
  const { getAccountMasterPaginate } = accountMasterRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getAccountMasterPaginate.call(knex, {
      body, params, logTrace,
      queryString: query
    });
    return response;
  };

}

function postAccountMasterService(fastify) {
  const { postAccountMaster } = accountMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postAccountMaster.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putAccountMasterService(fastify) {
  const { putAccountmaster } = accountMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { acc_id } = params;
    const promise1 = putAccountmaster.call(knex, {
      acc_id,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteAccountMasterService(fastify) {
  const { deleteAccountMaster } = accountMasterRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const { acc_id } = params;
    const promise1 = deleteAccountMaster.call(knex, {
      acc_id,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getAccountMasterInfoService(fastify) {
  const { getAccountMasterInfo } = accountMasterRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getAccountMasterInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getAccountMasterService,
  postAccountMasterService,
  putAccountMasterService,
  deleteAccountMasterService,
  getAccountMasterInfoService,
  getAccountMasterPaginateService
};

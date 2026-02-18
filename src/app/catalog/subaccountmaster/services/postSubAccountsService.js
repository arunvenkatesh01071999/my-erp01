
const subAccountsRepo = require("../repository/subAccounts");

function postSubAccountsService(fastify) {
  const { postSubAccounts } = subAccountsRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const promise1 = postSubAccounts.call(knex, {
      params,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function putSubAccountsService(fastify) {
  const { putSubAccounts } = subAccountsRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const { subaccount_id } = params;
    const promise1 = putSubAccounts.call(knex, {
      subaccount_id,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getSubAccountsService(fastify) {
  const { getSubAccounts } = subAccountsRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const promise1 = getSubAccounts.call(knex, {
      params,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getSubAccountsPaginateService(fastify) {
  const { getSubAccountsPaginate } = subAccountsRepo(fastify);
  return async ({ params, body, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const promise1 = getSubAccountsPaginate.call(knex, {
      params,
      body,
      logTrace,
      queryString: query

    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function deleteSubAccountsService(fastify) {
  const { deleteSubAccounts } = subAccountsRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const { subaccount_id } = params;
    const promise1 = deleteSubAccounts.call(knex, {
      subaccount_id,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getSubAccountsInfoService(fastify) {
  const { getSubAccountsInfo } = subAccountsRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const promise1 = getSubAccountsInfo.call(knex, {
      params,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getSubAccountsByAccService(fastify) {
  const { getSubAccountsByAcc } = subAccountsRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const promise1 = getSubAccountsByAcc.call(knex, {
      params,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

module.exports = {
  postSubAccountsService,
  putSubAccountsService,
  getSubAccountsService,
  deleteSubAccountsService,
  getSubAccountsInfoService,
  getSubAccountsPaginateService,
  getSubAccountsByAccService
};

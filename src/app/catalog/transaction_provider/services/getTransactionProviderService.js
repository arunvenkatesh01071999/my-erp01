const getTransactionProviderRepo = require("../repository/getTransactionProviderRepo");

function getTransactionProviderService(fastify) {
  const { getTransactionProvider } = getTransactionProviderRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getTransactionProvider.call(knex, {
      logTrace
    });
    return response;

  };
}

function getTransactionProviderMerchantKeyService(fastify) {
  const { getTransactionProviderMerchantKey } = getTransactionProviderRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getTransactionProviderMerchantKey.call(knex, {
      body, params, logTrace
    });
    return response;

  };
}



function postTransactionProviderService(fastify) {
  const { postTransactionProvider } = getTransactionProviderRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postTransactionProvider.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putTransactionProviderService(fastify) {
  const { putTransactionProvider } = getTransactionProviderRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { id } = params;
    const promise1 = putTransactionProvider.call(knex, {
      id,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteTransactionProviderService(fastify) {
  const { deleteTransactionProvider } = getTransactionProviderRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const { id } = params;
    const promise1 = deleteTransactionProvider.call(knex, {
      id,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


module.exports = {
  getTransactionProviderService,
  postTransactionProviderService,
  putTransactionProviderService,
  deleteTransactionProviderService,
  getTransactionProviderMerchantKeyService
};

const getTransactionTypeRepo = require("../repository/getTransactionTypeRepo");

function getTransactionTypeService(fastify) {
  const { getTransactionType } = getTransactionTypeRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getTransactionType.call(knex, {
      logTrace
    });
    return response;

  };
}

function getTransactionTypePaginateService(fastify) {
  const { getTransactionTypePaginate } = getTransactionTypeRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getTransactionTypePaginate.call(knex, {
      params,
      logTrace
    });
    return response;
  };

}

function postTransactionTypeService(fastify) {
  const { postTransactionType } = getTransactionTypeRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postTransactionType.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putTransactionTypeService(fastify) {
  const { putTransactionType } = getTransactionTypeRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { id } = params;
    const promise1 = putTransactionType.call(knex, {
      id,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteTransactionTypeService(fastify) {
  const { deleteTransactionType } = getTransactionTypeRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const { id } = params;
    const promise1 = deleteTransactionType.call(knex, {
      id,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getTransactionTypeInfoService(fastify) {
  const { getTransactionTypeInfo } = getTransactionTypeRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getTransactionTypeInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getTransactionTypeService,
  postTransactionTypeService,
  putTransactionTypeService,
  deleteTransactionTypeService,
  getTransactionTypeInfoService,
  getTransactionTypePaginateService
};

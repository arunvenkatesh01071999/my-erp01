const OfferTypeRepo = require("../repository/OfferTypes");

function getOfferTypeService(fastify) {
  const { getOfferType } = OfferTypeRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOfferType.call(knex, {
      logTrace
    });
    return response;
  };
}
function getOfferTypePaginateService(fastify) {
  const { getOfferTypePaginate } = OfferTypeRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getOfferTypePaginate.call(knex, {
      body, params, logTrace,
      queryString: query
    });
    return response;
  };
}

function postOfferTypeService(fastify) {
  const { postOfferType } = OfferTypeRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postOfferType.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function putOfferTypeService(fastify) {
  const { putOfferType } = OfferTypeRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { oid } = params;
    const promise1 = putOfferType.call(knex, {
      oid,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function deleteOfferTypeService(fastify) {
  const { deleteOfferType } = OfferTypeRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { oid } = params;
    const promise1 = deleteOfferType.call(knex, {
      oid,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getOfferTypeInfoService(fastify) {
  const { getOfferTypeInfo } = OfferTypeRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOfferTypeInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getOfferTypeService,
  postOfferTypeService,
  putOfferTypeService,
  deleteOfferTypeService,
  getOfferTypeInfoService,
  getOfferTypePaginateService
};

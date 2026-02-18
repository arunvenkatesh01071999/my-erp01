const OfferMasterRepo = require("../repository/priceOffer");


function getOfferMasterPaginateService(fastify) {
  const { getOfferMasterPaginate } = OfferMasterRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getOfferMasterPaginate.call(knex, {
      body, params, logTrace,
      queryString: query
    });
    return response;
  };
}
function postOfferMasterService(fastify) {
  const { postOfferMaster } = OfferMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postOfferMaster.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function putOfferMasterService(fastify) {
  const { putOfferMaster } = OfferMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = putOfferMaster.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function deleteOfferMasterService(fastify) {
  const { deleteOfferMaster } = OfferMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { id } = params;
    const promise1 = deleteOfferMaster.call(knex, {
      id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getOfferMasterInfoService(fastify) {
  const { getOfferMasterInfo } = OfferMasterRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOfferMasterInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}
function postOfferMasterExcelService(fastify) {
  const { postPriceOffExcel } = OfferMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postPriceOffExcel.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putOfferMasterExcelService(fastify) {
  const { putPriceOffExcel } = OfferMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = putPriceOffExcel.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

module.exports = {
  postOfferMasterService,
  putOfferMasterService,
  deleteOfferMasterService,
  getOfferMasterInfoService,
  getOfferMasterPaginateService,
  postOfferMasterExcelService,
  putOfferMasterExcelService
};

const salesManRepo = require("../repository/salesMan");

function getSalesManOutletMappingService(fastify) {
  const { getSalesManOutletMapping } = salesManRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSalesManOutletMapping.call(knex, {
      logTrace
    });
    return response;

  };
}
function getSalesManService(fastify) {
  const { getSalesMan } = salesManRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSalesMan.call(knex, {
      logTrace
    });
    return response;

  };
}

function getSalesManPaginateService(fastify) {
  const { getSalesManPaginate } = salesManRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSalesManPaginate.call(knex, {
      params,
      logTrace
    });
    return response;
  };

}

function postSalesManService(fastify) {
  const { postSalesMan } = salesManRepo(fastify);
  return async ({ params, body, logTrace, userDetails, files }) => {
    const knex = fastify.knexMedical;


    const promise1 = postSalesMan.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      files
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function postSalesManOutletMappingService(fastify) {
  const { postSalesManOutletMapping } = salesManRepo(fastify);
  return async ({ params, body, logTrace, userDetails, files }) => {
    const knex = fastify.knexMedical;


    const promise1 = postSalesManOutletMapping.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      files
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putSalesManService(fastify) {
  const { putSalesMan } = salesManRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { SalesMan_id } = params;
    const promise1 = putSalesMan.call(knex, {
      SalesMan_id,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putSalesManOutletMappingService(fastify) {
  const { putSalesManOutletMapping } = salesManRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { SalesMan_id } = params;
    const promise1 = putSalesManOutletMapping.call(knex, {
      SalesMan_id,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function deleteSalesManService(fastify) {
  const { deleteSalesMan } = salesManRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const { SalesMan_id } = params;
    const promise1 = deleteSalesMan.call(knex, {
      SalesMan_id,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getSalesManInfoService(fastify) {
  const { getSalesManInfo } = salesManRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSalesManInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}
function getSalesManInfoByBioCodeService(fastify) {
  const { getSalesManInfoByBioCode } = salesManRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSalesManInfoByBioCode.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

function getSalesManOutletMappingOneService(fastify) {
  const { getSalesManInfoOutletMappingOne } = salesManRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSalesManInfoOutletMappingOne.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}
function getSalesManOutletMappingOnePaginateService(fastify) {
  const { getSalesManInfoOutletMappingOnePaginate } = salesManRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getSalesManInfoOutletMappingOnePaginate.call(knex, {
      body, params, logTrace,
      queryString: query
    });
    return response;
  };
}

function getSalesManByOutletService(fastify) {
  const { getSalesManByOutlet } = salesManRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    console.log(params);
    const response = await getSalesManByOutlet.call(knex, {
      body,
      params,
      logTrace
    });
    return response;

  };
}

module.exports = {
  getSalesManService,
  postSalesManService,
  putSalesManService,
  deleteSalesManService,
  getSalesManInfoService,
  getSalesManPaginateService,
  postSalesManOutletMappingService,
  putSalesManOutletMappingService,
  getSalesManOutletMappingService,
  getSalesManOutletMappingOneService,
  getSalesManOutletMappingOnePaginateService,
  getSalesManByOutletService,
  getSalesManInfoByBioCodeService
};

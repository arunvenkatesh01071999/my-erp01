const typedesignRepo = require("../repository/typedesign");

function getTypedesignService(fastify) {
  const { getTypedesign } = typedesignRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getTypedesign.call(knex, {
      logTrace
    });
    return response;

  };
}


function getTypedesignCurrentdayService(fastify) {
  const { getTypedesignCurrentday } = typedesignRepo(fastify);

  return async ({ logTrace, params }) => {
    const knex = fastify.knexMedical;
    const response = await getTypedesignCurrentday.call(knex, {
      logTrace,
      params
    });
    return response;

  };
}



function getTypedesignPaginateService(fastify) {
  const { getTypedesignPaginate } = typedesignRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getTypedesignPaginate.call(knex, {
      body, params, logTrace,
      queryString: query

    });
    return response;
  };

}

function postTypedesignService(fastify) {
  const { postTypedesign } = typedesignRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postTypedesign.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putTypedesignService(fastify) {
  const { putTypedesign } = typedesignRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { typedesign_id } = params;
    const promise1 = putTypedesign.call(knex, {
      typedesign_id,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteTypedesignService(fastify) {
  const { deleteTypedesign } = typedesignRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { typedesign_id } = params;
    const promise1 = deleteTypedesign.call(knex, {
      typedesign_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getTypedesignInfoService(fastify) {
  const { getTypedesignInfo } = typedesignRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getTypedesignInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}
function getBrandTypedesignInfoService(fastify) {
  const { getBrandTypedesignInfo } = typedesignRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getBrandTypedesignInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getTypedesignService,
  postTypedesignService,
  putTypedesignService,
  deleteTypedesignService,
  getTypedesignInfoService,
  getTypedesignPaginateService,
  getBrandTypedesignInfoService,
  getTypedesignCurrentdayService
};

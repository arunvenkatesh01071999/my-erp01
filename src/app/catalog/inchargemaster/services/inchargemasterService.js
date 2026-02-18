const InchargeMasterRepo = require("../repository/inchargemaster");

function getInchargeMasterService(fastify) {
  const { getInchargeMaster } = InchargeMasterRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getInchargeMaster.call(knex, {
      logTrace
    });
    return response;

  };
}

function getInchargeMasterPaginateService(fastify) {
  const { getInchargeMasterPaginate } = InchargeMasterRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getInchargeMasterPaginate.call(knex, {
      body, params, logTrace,
      queryString: query

    });
    return response;
  };

}

function postInchargeMasterService(fastify) {
  const { postInchargeMaster } = InchargeMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postInchargeMaster.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putInchargeMasterService(fastify) {
  const { putInchargeMaster } = InchargeMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { inchargemaster_id } = params;
    const promise1 = putInchargeMaster.call(knex, {
      inchargemaster_id,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteInchargeMasterService(fastify) {
  const { deleteInchargeMaster } = InchargeMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { inchargemaster_id } = params;
    const promise1 = deleteInchargeMaster.call(knex, {
      inchargemaster_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getInchargeMasterInfoService(fastify) {
  const { getInchargeMasterInfo } = InchargeMasterRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getInchargeMasterInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

function getBrandInchargeMasterInfoService(fastify) {
  const { getBrandInchargeMasterInfo } = InchargeMasterRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getBrandInchargeMasterInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getInchargeMasterService,
  postInchargeMasterService,
  putInchargeMasterService,
  deleteInchargeMasterService,
  getInchargeMasterInfoService,
  getInchargeMasterPaginateService,
  getBrandInchargeMasterInfoService
};

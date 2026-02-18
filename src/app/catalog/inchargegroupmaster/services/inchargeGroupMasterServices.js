const inchargeGroupMasterRepo = require("../repository/inchargeGroupMaster");

function getInchargeGroupMasterService(fastify) {
  const { getInchargeGroupMaster } = inchargeGroupMasterRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getInchargeGroupMaster.call(knex, {
      logTrace
    });
    return response;

  };
}

function getInchargeGroupMasterPaginateService(fastify) {
  const { getInchargeGroupMasterPaginate } = inchargeGroupMasterRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getInchargeGroupMasterPaginate.call(knex, {
      body, params, logTrace,
      queryString: query

    });
    return response;
  };

}

function postInchargeGroupMasterService(fastify) {
  const { postInchargeGroupMaster } = inchargeGroupMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postInchargeGroupMaster.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putInchargeGroupMasterService(fastify) {
  const { putInchargeGroupMaster } = inchargeGroupMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { inchargegroupmaster_id } = params;
    const promise1 = putInchargeGroupMaster.call(knex, {
      inchargegroupmaster_id,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteInchargeGroupMasterService(fastify) {
  const { deleteInchargeGroupMaster } = inchargeGroupMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { inchargegroupmaster_id } = params;
    const promise1 = deleteInchargeGroupMaster.call(knex, {
      inchargegroupmaster_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getInchargeGroupMasterInfoService(fastify) {
  const { getInchargeGroupMasterInfo } = inchargeGroupMasterRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getInchargeGroupMasterInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

function getBrandInchargeGroupMasterInfoService(fastify) {
  const { getBrandInchargeGroupMasterInfo } = inchargeGroupMasterRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getBrandInchargeGroupMasterInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getInchargeGroupMasterService,
  postInchargeGroupMasterService,
  putInchargeGroupMasterService,
  deleteInchargeGroupMasterService,
  getInchargeGroupMasterInfoService,
  getInchargeGroupMasterPaginateService,
  getBrandInchargeGroupMasterInfoService
};

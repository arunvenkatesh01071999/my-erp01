const traymasterRepo = require("../repository/traymaster");

function getTrayMasterService(fastify) {
  const { getTrayMaster } = traymasterRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getTrayMaster.call(knex, {
      logTrace
    });
    return response;

  };
}

function getTrayMasterPaginateService(fastify) {
  const { getTrayMasterPaginate } = traymasterRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getTrayMasterPaginate.call(knex, {
      body, params, logTrace,
      queryString: query

    });
    return response;
  };

}

function postTrayMasterService(fastify) {
  const { postTrayMaster } = traymasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postTrayMaster.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putTrayMasterService(fastify) {
  const { putTrayMaster } = traymasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { traymaster_id } = params;
    const promise1 = putTrayMaster.call(knex, {
      traymaster_id,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteTrayMasterService(fastify) {
  const { deleteTrayMaster } = traymasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { traymaster_id } = params;
    const promise1 = deleteTrayMaster.call(knex, {
      traymaster_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getTrayMasterInfoService(fastify) {
  const { getTrayMasterInfo } = traymasterRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getTrayMasterInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

function getBrandTrayMasterInfoService(fastify) {
  const { getBrandTrayMasterInfo } = traymasterRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getBrandTrayMasterInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getTrayMasterService,
  postTrayMasterService,
  putTrayMasterService,
  deleteTrayMasterService,
  getTrayMasterInfoService,
  getTrayMasterPaginateService,
  getBrandTrayMasterInfoService
};

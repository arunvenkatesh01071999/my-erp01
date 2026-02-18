const pickermasterRepo = require("../repository/pickermaster");

function getPickerMasterService(fastify) {
  const { getPickerMaster } = pickermasterRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getPickerMaster.call(knex, {
      logTrace
    });
    return response;

  };
}

function getPickerMasterPaginateService(fastify) {
  const { getPickerMasterPaginate } = pickermasterRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getPickerMasterPaginate.call(knex, {
      body, params, logTrace,
      queryString: query

    });
    return response;
  };

}

function postPickerMasterService(fastify) {
  const { postPickerMaster } = pickermasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postPickerMaster.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putPickerMasterService(fastify) {
  const { putPickerMaster } = pickermasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { pickermaster_id } = params;
    const promise1 = putPickerMaster.call(knex, {
      pickermaster_id,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deletePickerMasterService(fastify) {
  const { deletePickerMaster } = pickermasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { pickermaster_id } = params;
    const promise1 = deletePickerMaster.call(knex, {
      pickermaster_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getPickerMasterInfoService(fastify) {
  const { getPickerMasterInfo } = pickermasterRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getPickerMasterInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

function getBrandPickerMasterInfoService(fastify) {
  const { getBrandPickerMasterInfo } = pickermasterRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getBrandPickerMasterInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getPickerMasterService,
  postPickerMasterService,
  putPickerMasterService,
  deletePickerMasterService,
  getPickerMasterInfoService,
  getPickerMasterPaginateService,
  getBrandPickerMasterInfoService
};

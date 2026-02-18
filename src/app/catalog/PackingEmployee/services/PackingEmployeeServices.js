const PackingEmployeeRepo = require("../repository/PackingEmployees");

function getPackingEmployeeService(fastify) {
  const { getPackingEmployee } = PackingEmployeeRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getPackingEmployee.call(knex, {
      logTrace
    });
    return response;
  };
}
function getPackingEmployeePaginateService(fastify) {
  const { getPackingEmployeePaginate } = PackingEmployeeRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getPackingEmployeePaginate.call(knex, {
      body, params, logTrace,
      queryString: query
    });
    return response;
  };
}

function postPackingEmployeeService(fastify) {
  const { postPackingEmployee } = PackingEmployeeRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postPackingEmployee.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function putPackingEmployeeService(fastify) {
  const { putPackingEmployee } = PackingEmployeeRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { id } = params;
    const promise1 = putPackingEmployee.call(knex, {
      id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function deletePackingEmployeeService(fastify) {
  const { deletePackingEmployee } = PackingEmployeeRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { id } = params;
    const promise1 = deletePackingEmployee.call(knex, {
      id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getPackingEmployeeInfoService(fastify) {
  const { getPackingEmployeeInfo } = PackingEmployeeRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getPackingEmployeeInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getPackingEmployeeService,
  postPackingEmployeeService,
  putPackingEmployeeService,
  deletePackingEmployeeService,
  getPackingEmployeeInfoService,
  getPackingEmployeePaginateService
};

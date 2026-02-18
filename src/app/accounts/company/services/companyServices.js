const companyRepo = require("../repository/company");

function postCompanyService(fastify) {
  const { postCompany } = companyRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postCompany.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putCompanyService(fastify) {
  const { putCompany } = companyRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { company_id } = params;
    const promise1 = putCompany.call(knex, {
      company_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteCompanyService(fastify) {
  const { deleteCompany } = companyRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { company_id } = params;
    const promise1 = deleteCompany.call(knex, {
      company_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getCompanyService(fastify) {
  const { getCompany } = companyRepo(fastify);

  return async ({ params, body, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getCompany.call(knex, {
      params,
      body,
      queryString: query,
      logTrace
    });
    return response;
  };
}
function getCompanyInfoService(fastify) {
  const { getCompanyInfo } = companyRepo(fastify);

  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getCompanyInfo.call(knex, {
      params,
      body,
      logTrace
    });
    return response;
  };
}

function getCompanyDetailsService(fastify) {
  const { getCompanyDetailsRepo } = companyRepo(fastify);

  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getCompanyDetailsRepo.call(knex, {
      params,
      body,
      logTrace
    });
    return response;
  };
}

module.exports = {
  postCompanyService,
  putCompanyService,
  deleteCompanyService,
  getCompanyService,
  getCompanyInfoService,
  getCompanyDetailsService
};

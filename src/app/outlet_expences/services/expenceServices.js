const outletexpenceRepo = require("../repository/expences");
// const partyledgerRepo = require("../../../partyledger/repository")


function deleteExpenceWithOutletExpencesDetailsService(fastify) {
  const { deleteOutletExpencesWithOutletExpencesDetails } = outletexpenceRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    // const financialYear = getFinancialYear();
    const promise1 = deleteOutletExpencesWithOutletExpencesDetails.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function postOutletExpenceService(fastify) {
  const { postOutletExpences } = outletexpenceRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postOutletExpences.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      financialYear
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function postExpenceWithOutletExpencesDetailsService(fastify) {
  const { postOutletExpencesWithOutletExpencesDetails } = outletexpenceRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postOutletExpencesWithOutletExpencesDetails.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      financialYear
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getOutletExpenceService(fastify) {
  const { getOutletExpenceDocno } = outletexpenceRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const response = await getOutletExpenceDocno.call(knex, {
      params,
      logTrace,
      financialYear
    });
    return response;

  };
}

const getFinancialYear = (date = new Date()) => {
  const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1 to get 1-12
  const year = date.getFullYear();

  const formatYear = (year) => year.toString().slice(-2); // Get last two digits of the year

  if (month >= 4) {
    // If the month is April or later, the financial year starts from this year
    return `${formatYear(year)}_${formatYear(year + 1)}`;
  } else {
    // If the month is January to March, the financial year starts from the previous year
    return `${formatYear(year - 1)}_${formatYear(year)}`;
  }
};

function getAllOutletExpenceService(fastify) {
  const { getAllOutletExpence } = outletexpenceRepo(fastify);

  return async ({ params, body, userDetails, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getAllOutletExpence.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    return response;

  };
}

function updateOutletExpenceService(fastify) {
  const { updateOutletExpences } = outletexpenceRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { id } = params;
    const promise1 = updateOutletExpences.call(knex, {
      id,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getAllOutletExpenceWithOutletExpencesDetailsService(fastify) {
  const { getAllOutletExpenceWithOutletExpencesDetails } = outletexpenceRepo(fastify);

  return async ({ params, body, userDetails, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getAllOutletExpenceWithOutletExpencesDetails.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    return response;

  };
}

module.exports = {

  postOutletExpenceService,
  getOutletExpenceService,
  getAllOutletExpenceService,
  updateOutletExpenceService,
  postExpenceWithOutletExpencesDetailsService,
  getAllOutletExpenceWithOutletExpencesDetailsService,
  deleteExpenceWithOutletExpencesDetailsService
};

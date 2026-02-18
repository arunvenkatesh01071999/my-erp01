const expenceRepo = require("../repository/expences");





function postExpenceWithExpencesDetailsService(fastify) {
  const { postExpencesWithExpencesDetails } = expenceRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postExpencesWithExpencesDetails.call(knex, {
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

function deleteExpenceWithExpencesDetailsService(fastify) {
  const { deleteExpencesWithExpencesDetails } = expenceRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = deleteExpencesWithExpencesDetails.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

const getFinancialYear = (date = new Date()) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formatYear = (year) => year.toString().slice(-2);

  if (month >= 4) {

    return `${formatYear(year)}_${formatYear(year + 1)}`;
  } else {

    return `${formatYear(year - 1)}_${formatYear(year)}`;
  }
}

function postExpenceService(fastify) {
  const { postExpences } = expenceRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postExpences.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getExpensesService(fastify) {
  const { getExpenseDocno } = expenceRepo(fastify);
  const financialYear = getFinancialYear();

  return async ({ params,
    body,
    logTrace,
    userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await getExpenseDocno.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      financialYear
    });
    return response;

  };
}

function getAllExpencesService(fastify) {
  const { getAllExpences } = expenceRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getAllExpences.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}

function getAllExpencesExpencesDetailsService(fastify) {
  const { getAllExpencesExpencesDetails } = expenceRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getAllExpencesExpencesDetails.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}

function updateExpencesService(fastify) {
  const { updateExpences } = expenceRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { id } = params;
    const promise1 = updateExpences.call(knex, {
      id,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}




module.exports = {
  postExpenceWithExpencesDetailsService,
  postExpenceService,
  getExpensesService,
  getAllExpencesService,
  updateExpencesService,
  getAllExpencesExpencesDetailsService,
  getFinancialYear,
  deleteExpenceWithExpencesDetailsService
};

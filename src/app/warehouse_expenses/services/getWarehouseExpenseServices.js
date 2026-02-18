const getWarehouseExpenseRepo = require("../repository/getWarehouseExpenseRepo");

function postWarehouseExpenseService(fastify) {
  const { postWarehouseExpenseRepo } = getWarehouseExpenseRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postWarehouseExpenseRepo.call(knex, {
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

function deleteWarehouseExpenseService(fastify) {
  const { deleteWarehouseExpenseRepo } = getWarehouseExpenseRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = deleteWarehouseExpenseRepo.call(knex, {
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

function getWarehouseExpenseDocnoService(fastify) {
  const { getWarehouseExpenseDocnoRepo } = getWarehouseExpenseRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getWarehouseExpenseDocnoRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getWarehouseExpenseDatewiseService(fastify) {
  const { getWarehouseExpenseDatewiseRepo } = getWarehouseExpenseRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getWarehouseExpenseDatewiseRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


module.exports = {
  postWarehouseExpenseService,
  deleteWarehouseExpenseService,
  getWarehouseExpenseDocnoService,
 getWarehouseExpenseDatewiseService,
  getFinancialYear
};

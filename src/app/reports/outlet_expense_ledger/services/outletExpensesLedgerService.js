const outletExpencesLedgerRepo = require("../repository/outletExpensesLedgerRepo.js");

function outletExpencesLedgerOutletWiseService(fastify) {
  const { outletExpencesLedgerOutletWise } = outletExpencesLedgerRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await outletExpencesLedgerOutletWise.call(knex, {
      body,
      params,
      logTrace
    });
    const total_no_of_bills = response.reduce((acc, order) => {
      return acc + parseInt(order.bills, 10);
    }, 0);

    const total_amount = response.reduce((acc, order) => {
      return acc + parseFloat(order.total);
    }, 0);

    const transformedResponse = {
      total_no_of_bills,
      total_amount,
      details: response
    };

    return transformedResponse;
    // return response;
  };
}
function outletExpencesLedgerYearService(fastify) {
  const { getOutletExpencesLedgerYear } = outletExpencesLedgerRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletExpencesLedgerYear.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}
function getOutletExpenceLedgerByMonthService(fastify) {
  const { getOutletExpenceLedgerByMonth } = outletExpencesLedgerRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getOutletExpenceLedgerByMonth.call(knex, {
      body,
      params,
      logTrace
    });

    const total_no_of_sales = response.reduce((acc, order) => {
      return acc + parseInt(order.no_of_sales, 10);
    }, 0);

    const total_amount = response.reduce((acc, order) => {
      return acc + parseFloat(order.amount);
    }, 0);

    const transformedResponse = {
      year: params.year,
      month: params.month,
      total_no_of_sales: total_no_of_sales,
      total_amount: total_amount,
      details: response
    };

    return transformedResponse;
  };
}

function outletExpenceLedgerByDateService(fastify) {
  const { getOutletExpenceLedgerByDate } = outletExpencesLedgerRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getOutletExpenceLedgerByDate.call(knex, {
      params,
      logTrace,
      page_size: params.page_size,
      current_page: params.current_page
    });


    return response;
  };
}

module.exports = {
  outletExpencesLedgerYearService,
  getOutletExpenceLedgerByMonthService,
  outletExpenceLedgerByDateService,
  outletExpencesLedgerOutletWiseService
};

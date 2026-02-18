const salesRepo = require("../repository/sales.js");

function expenceLedgerService(fastify) {
  const { getexpenceLedger } = salesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getexpenceLedger.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}
function getexpenceLedgerByMonthService(fastify) {
  const { getexpenceLedgerByMonth } = salesRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getexpenceLedgerByMonth.call(knex, {
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
function getexpenceLedgerPaginateByDateService(fastify) {
  const { getExpenceLedgerPaginateByDate } = salesRepo(fastify);

  return async ({ params, logTrace, page_size, current_page }) => {
    const knex = fastify.knexMedical;

    const response = await getExpenceLedgerPaginateByDate.call(knex, {
      params,
      logTrace,
      page_size: params.page_size,
      current_page: params.current_page
    });


    return response;
  };
}

module.exports = {
  expenceLedgerService,
  getexpenceLedgerByMonthService,
  getexpenceLedgerPaginateByDateService
};

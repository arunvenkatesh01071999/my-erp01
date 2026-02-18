const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const purchaseRepo = require("../repository/purchase");


function getPurchaseByYearService(fastify) {
  const { getPurchaseByYear } = purchaseRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getPurchaseByYear.call(knex, {
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
      total_no_of_sales: total_no_of_sales,
      total_amount: total_amount,
      details: response
    };

    return transformedResponse;
  };
}

function getPurchaseByMonthService(fastify) {
  const { getPurchaseByMonth } = purchaseRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getPurchaseByMonth.call(knex, {
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
function getPurchasePaginateByDateService(fastify) {
  const { getPurchasePaginateByDate } = purchaseRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getPurchasePaginateByDate.call(knex, {
      params,
      logTrace,
      page_size: params.page_size,
      current_page: params.current_page
    });


    return response;
  };
}

function calculateGrandTotalAndQuantity(data) {
  let grandTotal = 0;
  let totalQuantity = 0;

  for (const item of data) {
    grandTotal += parseInt(item.total, 10);
    totalQuantity += parseInt(item.quantity, 10);
  }

  return { grandTotal, totalQuantity };
}


module.exports = {
  getPurchaseByYearService,
  getPurchaseByMonthService,
  getPurchasePaginateByDateService
};

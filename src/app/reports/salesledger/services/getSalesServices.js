const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const salesRepo = require("../repository/sales");


function getSalesByYearService(fastify) {
  const { getSaleByYear } = salesRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getSaleByYear.call(knex, {
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

function getSalesByMonthService(fastify) {
  const { getSalesByMonth } = salesRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getSalesByMonth.call(knex, {
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
function getSalesPaginateByDateService(fastify) {
  const { getSalesPaginateByDate } = salesRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getSalesPaginateByDate.call(knex, {
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

function getallOutletsIssueService(fastify) {
  const { getallOutletsIssue } = salesRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getallOutletsIssue.call(knex, {
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
  };
}


module.exports = {
  getSalesByYearService,
  getSalesByMonthService,
  getSalesPaginateByDateService,
  getallOutletsIssueService
};

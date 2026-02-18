const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../../errorHandler");

const getOutletSalesRepo = require("../repository/outlet_sales");


function getOutletSalesByYearService(fastify) {
  const { getOutletSaleByYear } = getOutletSalesRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getOutletSaleByYear.call(knex, {
      body,
      params,
      logTrace
    });

    const total_no_of_OutletSales = response.reduce((acc, order) => {
      return acc + parseInt(order.no_of_OutletSales, 10);
    }, 0);

    const total_amount = response.reduce((acc, order) => {
      return acc + parseFloat(order.amount);
    }, 0);

    const transformedResponse = {
      year: params.year,
      total_no_of_OutletSales: total_no_of_OutletSales,
      total_amount: total_amount,
      details: response
    };

    return transformedResponse;
  };
}

function getOutletSalesByMonthService(fastify) {
  const { getOutletSalesByMonth } = getOutletSalesRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getOutletSalesByMonth.call(knex, {
      body,
      params,
      logTrace
    });

    const total_no_of_OutletSales = response.reduce((acc, order) => {
      return acc + parseInt(order.no_of_OutletSales, 10);
    }, 0);

    const total_amount = response.reduce((acc, order) => {
      return acc + parseFloat(order.amount);
    }, 0);

    const transformedResponse = {
      year: params.year,
      month: params.month,
      total_no_of_OutletSales: total_no_of_OutletSales,
      total_amount: total_amount,
      details: response
    };

    return transformedResponse;
  };
}
function getOutletSalesPaginateByDateService(fastify) {
  const { getOutletSalesPaginateByDate } = getOutletSalesRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getOutletSalesPaginateByDate.call(knex, {
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
function getallOutletsSalesService(fastify) {
  const { getallOutletsSales } = getOutletSalesRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getallOutletsSales.call(knex, {
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
  getOutletSalesByYearService,
  getOutletSalesByMonthService,
  getOutletSalesPaginateByDateService,
  getallOutletsSalesService
};

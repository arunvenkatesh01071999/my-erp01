const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const ordersRepo = require("../repository/orders");

function getOrderService(fastify) {
  const { getOrder } = ordersRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await getOrder.call(knex, {
      params,
      logTrace
    });

    const transformedResult = response.map(item => {
      let status_name;
      switch (item.orders_status) {
        case 0:
          status_name = "NEWORDER";
          break;
        case 1:
          status_name = "PROCESSING";
          break;
        case 2:
          status_name = "INVOICE";
          break;
        case 3:
          status_name = "TRANSISTS";
          break;
        case 4:
          status_name = "DELIVERED";
          break;
        case 5:
          status_name = "CANCELLED";
          break;

        default:
          status_name = ""; // Default value if no match
          break;
      }
      return {
        orders_status_text: status_name,
        ...item
      };
    });
    return transformedResult;
    // return response;
  };
}
function getOrderPaginateService(fastify) {
  const { getOrderPaginate } = ordersRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getOrderPaginate.call(knex, {
      params,
      logTrace,
      page_size: params.page_size,
      current_page: params.current_page
    });
    const transformedResponse = {
      data: response.data.map(item => {
        let status_name;
        switch (item.orders_status) {
          case 0:
            status_name = "NEWORDER";
            break;
          case 1:
            status_name = "PROCESSING";
            break;
          case 2:
            status_name = "INVOICE";
            break;
          case 3:
            status_name = "TRANSISTS";
            break;
          case 4:
            status_name = "DELIVERED";
            break;
          case 5:
            status_name = "CANCELLED";
            break;

          default:
            status_name = ""; // Default value if no match
            break;
        }
        return {
          orders_status_text: status_name,
          ...item
        };
      }),
      meta: response.meta
    };
    // console.log(transformedResponse);
    return transformedResponse;
  };
}
function getOrderByIdService(fastify) {
  const { getOrderById } = ordersRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getOrderById.call(knex, {
      logTrace,
      order_id: params.order_id
    });

    let status_name;
    switch (response.orders_status) {
      case 0:
        status_name = "NEWORDER";
        break;
      case 1:
        status_name = "PROCESSING";
        break;
      case 2:
        status_name = "INVOICE";
        break;
      case 3:
        status_name = "TRANSISTS";
        break;
      case 4:
        status_name = "DELIVERED";
        break;
      case 5:
        status_name = "CANCELLED";
        break;

      default:
        status_name = ""; // Default value if no match
        break;
    }
    return {
      orders_status_text: status_name,
      ...response
    };
  };
}
function getOrderStatusService(fastify) {
  const { getOrderStatus } = ordersRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getOrderStatus.call(knex, {
      logTrace
    });

    const transformedResult = response.map(item => {
      let status_name;
      switch (item.orders_status) {
        case 0:
          status_name = "NEWORDER";
          break;
        case 1:
          status_name = "PROCESSING";
          break;
        case 2:
          status_name = "INVOICE";
          break;
        case 3:
          status_name = "TRANSISTS";
          break;
        case 4:
          status_name = "DELIVERED";
          break;
        case 5:
          status_name = "CANCELLED";
          break;

        default:
          status_name = ""; // Default value if no match
          break;
      }
      return {
        status_name,
        ...item
      };
    });
    return transformedResult;
  };
}
function OrderStatusChangeService(fastify) {
  const { OrderStatusChange } = ordersRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await OrderStatusChange.call(knex, {
      body,
      params,
      logTrace
    });

    return response;
  };
}
function getOrderByYearService(fastify) {
  const { getOrdersByYear } = ordersRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getOrdersByYear.call(knex, {
      body,
      params,
      logTrace
    });

    const total_no_of_order = response.reduce((acc, order) => {
      return acc + parseInt(order.no_of_order, 10);
    }, 0);

    const total_amount = response.reduce((acc, order) => {
      return acc + parseFloat(order.amount);
    }, 0);

    const transformedResponse = {
      year: params.year,
      total_no_of_order: total_no_of_order,
      total_amount: total_amount,
      details: response
    };

    return transformedResponse;
  };
}
function getOrderBySalesService(fastify) {
  const { getOrdersBySalesMonth } = ordersRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getOrdersBySalesMonth.call(knex, {
      body,
      params,
      logTrace
    });

    const total_no_of_order = response.reduce((acc, order) => {
      return acc + parseInt(order.no_of_order, 10);
    }, 0);

    const total_amount = response.reduce((acc, order) => {
      return acc + parseFloat(order.amount);
    }, 0);

    const transformedResponse = {
      year: params.year,
      month: params.month,
      total_no_of_order: total_no_of_order,
      total_amount: total_amount,
      details: response
    };

    return transformedResponse;
  };
}
function getOrderPaginateByDateService(fastify) {
  const { getOrderPaginateByDate } = ordersRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getOrderPaginateByDate.call(knex, {
      params,
      logTrace,
      page_size: params.page_size,
      current_page: params.current_page
    });
    const transformedResponse = {
      data: response.data.map(item => {
        let status_name;
        switch (item.orders_status) {
          case 0:
            status_name = "NEWORDER";
            break;
          case 1:
            status_name = "PROCESSING";
            break;
          case 2:
            status_name = "INVOICE";
            break;
          case 3:
            status_name = "TRANSISTS";
            break;
          case 4:
            status_name = "DELIVERED";
            break;
          case 5:
            status_name = "CANCELLED";
            break;

          default:
            status_name = ""; // Default value if no match
            break;
        }
        return {
          orders_status_text: status_name,
          ...item
        };
      }),
      meta: response.meta
    };
    // console.log(transformedResponse);
    return transformedResponse;
  };
}
function getItemsSalesService(fastify) {
  const { getItemsSales } = ordersRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getItemsSales.call(knex, {
      body,
      params,
      logTrace
    });

    // Calculate grand total and total quantity
    const { grandTotal, totalQuantity } = calculateGrandTotalAndQuantity(
      response.data
    );

    // Update the response object with calculated values
    response.grandTotal = grandTotal;
    response.totalQuantity = totalQuantity;
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
function getCategorySalesService(fastify) {
  const { getCategorySales } = ordersRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getCategorySales.call(knex, {
      body,
      params,
      logTrace
    });

    // Calculate grand total and total quantity
    const { grandTotal, totalQuantity } = calculateGrandTotalAndQuantity(
      response.data
    );

    // Update the response object with calculated values
    response.grandTotal = grandTotal;
    response.totalQuantity = totalQuantity;
    return response;
  };
}

module.exports = {
  getOrderService,
  getOrderByIdService,
  getOrderPaginateService,
  getOrderStatusService,
  OrderStatusChangeService,
  getOrderByYearService,
  getOrderBySalesService,
  getOrderPaginateByDateService,
  getItemsSalesService,
  getCategorySalesService
};
